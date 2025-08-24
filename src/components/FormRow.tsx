/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '.'
import { STATUS } from '../constants'
import { useCreateBoard } from '../hooks/useCreateBoard'
import useGetBoard from '../hooks/useGetBoard'
import { useGetTask } from '../hooks/useGetTask.js'
import { useKanban } from '../pages/KanbanBoard'
import { editBoardName } from '../utils/editBoardName'

const FormRow = ({
  labelText,
  type,
  name,
  placeholder,
  inputType,
  required = true,
  register,
  setIsEditingBoard,
  setIsOptionsOpen,
  isEditingBoard,
  changeTaskStatus,
  defaultValue,
  page,
  setShowPassword,
  value,
  onChange,
}: FormRowProps) => {
  const [passwordHasValues, setPasswordHasValues] = useState(false)
  const queryClient = useQueryClient()
  const { setCreateNewBoard, selectedBoard, isSidebarOpen } = useKanban()
  const { handleSubmit, onSubmit, register: createBoardRegister, errors, watch } = useCreateBoard()

  const createBoardInputHasValue = watch('boardName')?.length > 0

  const { data: board } = useGetBoard()
  const { data: task } = useGetTask() as Task
  const [taskStatus, setTaskStatus] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!task) return
    if (task?.data?.status) setTaskStatus(task?.data?.status)
  }, [task?.data?.status, task])

  const { register: editBoardRegister, handleSubmit: editBoardSubmit } = useForm()

  // editing the boardName
  const onEditBoardNameSubmit = (data: object) => {
    editBoardName(selectedBoard, data, queryClient)
    setIsEditingBoard?.(false)
    setIsOptionsOpen?.(false)
  }

  if (inputType === 'options')
    return (
      <>
        <label className="font-thin text-black" htmlFor={labelText}>
          Status
        </label>
        <select defaultValue={name && defaultValue} {...register?.('status')} className="p-2 rounded-md cursor-pointer">
          {STATUS.map((opt) => (
            <option value={opt} className="capitalize" key={opt}>
              {opt.toUpperCase()}
            </option>
          ))}
        </select>
      </>
    )
  if (inputType === 'edit-options')
    return (
      <div className={`flex flex-col gap-2 ${isOpen ? 'mb-36' : 'mb-0'}`}>
        <label className="text-black font-semibold" htmlFor={labelText}>
          Status
        </label>

        <div className="dropdown w-full">
          <label onClick={() => setIsOpen(!isOpen)} tabIndex={0} className="btn w-full p-2 rounded-md cursor-pointer bg-accent hover:bg-opacity-70 hover:bg-accent text-black">
            {taskStatus.toUpperCase()}
          </label>

          {isOpen && (
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow rounded-box w-full bg-accent text-black">
              {STATUS.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    changeTaskStatus?.(opt)
                    setTaskStatus(opt)
                    setIsOpen(false)
                  }}
                >
                  <a className="capitalize">{opt.toUpperCase()}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )

  // when not editing the board show the add task form
  if (name === 'board' && !isEditingBoard)
    return (
      <div className="bg-white w-max right-4 p-4 shadow-lg relative bottom-8 md:bottom-12 2xl:bottom-2">
        <div className={`flex items-center gap-2 pl-6 board-input relative`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {errors.boardName?.message ? <p className={`text-sm text-red-600 bg-white ${errors && 'p-2'} absolute bottom-11`}>{errors.boardName?.message}</p> : ''}
            <input
              autoFocus
              className="rounded h-10 pl-2 w-52 border border-black bg-white text-black"
              required={required}
              type={type}
              {...createBoardRegister('boardName', {
                maxLength: {
                  value: 45,
                  message: 'Minimum 45 characters',
                },
              })}
              placeholder={placeholder}
            />
          </form>
          <Button
            type="cross"
            onClick={() => {
              setCreateNewBoard(false)
            }}
          />
        </div>
        {createBoardInputHasValue && (
          <button onClick={handleSubmit(onSubmit)} className="font-thin btn-color p-2 rounded-3xl relative left-6 top-2 ">
            Create
          </button>
        )}
      </div>
    )

  if (isEditingBoard)
    return (
      <div
        className={`flex items-center gap-2 
         mt-0
         left-96 board-input relative`}
      >
        <form onSubmit={editBoardSubmit(onEditBoardNameSubmit)}>
          {errors.boardName?.message ? <p className={`text-sm text-red-600 bg-white ${errors && 'p-2'} absolute bottom-11`}>{errors.boardName?.message}</p> : ''}
          <input
            defaultValue={board?.data.boardName}
            autoFocus
            className="rounded h-6 sm:h-10 pl-2 w-32 sm:w-96 text-sm text-black bg-white outline-none"
            {...editBoardRegister('boardName', {
              maxLength: {
                value: 45,
                message: 'Minimum 45 characters',
              },
            })}
            required={required}
            type={type}
            onBlur={() => setIsEditingBoard?.(false)}
            placeholder={placeholder}
          />
        </form>
      </div>
    )

  // login and register page inputs
  if (name === 'name' || name === 'email' || name === 'password')
    return (
      <>
        <div className="flex justify-between">
          <label className="font-thin text-black" htmlFor={labelText}>
            {labelText}
          </label>
          {/* if password has value, show the show password checkbox */}
          {name === 'password' && passwordHasValues && (
            <div className="text-xs sm:text-sm flex items-center text-black gap-2">
              <label className="font-thin" htmlFor="checkbox">
                Show Password
              </label>
              <input className="cursor-pointer text-black" onChange={(e) => (e.target.checked ? setShowPassword!(true) : setShowPassword!(false))} type="checkbox" />
            </div>
          )}
        </div>
        <input
          onChange={(e) => {
            name === 'password' && e.target.value ? setPasswordHasValues(true) : setPasswordHasValues(false)
          }}
          autoFocus={page === 'login' ? name === 'email' : name === 'name'}
          className="rounded h-12 pl-2 w-full sm:w-96 m-auto input input-bordered bg-white text-black outline-1 outline"
          required={required}
          type={type}
          name={name}
          placeholder={placeholder}
        />
      </>
    )

  return (
    <div className="flex flex-col w-full">
      <label className="font-thin text-black" htmlFor={labelText}>
        {labelText}
      </label>

      {labelText === 'Description' ? (
        <textarea defaultValue={name && defaultValue} {...register?.('description')} placeholder={placeholder} className="h-32 rounded pl-2 pt-1 w-full resize-none text-white"></textarea>
      ) : (
        <input
          value={value}
          defaultValue={name && defaultValue}
          autoFocus={name === 'title' && true}
          className={`rounded h-12 pl-2 w-full text-white ${name === 'subtask2' && 'animate-fade animate-duration-500'} `}
          {...register?.(name, { required: name === 'title' && `${name} is required` })}
          onChange={onChange}
          type={type}
          name={name}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
export default FormRow

export interface IFormValues {
  title: string
  description: string
  subtask1: string
  subtask2: string
  status: string
  name: string
}

type Task = {
  data: {
    data: {
      description: string
      status: string
      subtasks: Array<{ name: string; status: string; _id: string }>
      title: string
      _id: string
    }
  }
}

type FormRowProps = {
  labelText?: string
  type: string
  name: string
  placeholder?: string
  inputType?: string
  required?: boolean
  register?: any
  isEditingBoard?: boolean
  setIsEditingBoard?: (arg: boolean) => void
  setIsOptionsOpen?: (arg: boolean) => void
  changeTaskStatus?: (newStatus: string) => void
  defaultValue?: string
  page?: string
  setShowPassword?: (arg: boolean) => void
  value?: string
  onChange?: (e) => void
}
