import { UseFormRegister, useForm } from 'react-hook-form'
import { Button } from '.'
import { OPTIONS } from '../constants'
import { useCreateBoard } from '../hooks/useCreateBoard'
import { useKanban } from '../pages/KanbanBoard'
import { editBoardName } from '../utils/editBoardName'
import { useQueryClient } from '@tanstack/react-query'
import useGetBoard from '../hooks/useGetBoard'
import { useGetTask } from '../hooks/useGetTask.js'
import { useState } from 'react'


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
      subtasks: Array<{ name: string, status: string, _id: string }>
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
  register?: UseFormRegister<IFormValues>
  isEditingBoard?: boolean
  setIsEditingBoard?: (arg: boolean) => void
  setIsOptionsOpen?: (arg: boolean) => void
  changeTaskStatus?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  defaultValue?: string
  page?: string
  setShowPassword?: (arg: boolean) => void
}

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
  setShowPassword
}: FormRowProps) => {
  const [passwordHasValues, setPasswordHasValues] = useState(false)
  const queryClient = useQueryClient()
  const { setCreateNewBoard, selectedBoard } = useKanban()
  const {
    handleSubmit,
    onSubmit,
    register: createBoardRegister,
    errors, watch
  } = useCreateBoard()

  const createBoardInputHasValue = watch('boardName')?.length > 0

  const { data: board } = useGetBoard()
  const { data: task } = useGetTask() as Task


  const { register: editBoardRegister, handleSubmit: editBoardSubmit } =
    useForm()

  // editing the boardName
  const onEditBoardNameSubmit = (data: object) => {
    editBoardName(selectedBoard, data, queryClient)
    setIsEditingBoard?.(false)
    setIsOptionsOpen?.(false)
  }

  if (inputType === 'options')
    return (
      <>
        <label className='font-thin text-white' htmlFor={labelText}>
          Status
        </label>
        <select
          defaultValue={name && defaultValue}
          {...register?.('status')}
          className='p-2 rounded-md cursor-pointer'
        >
          {OPTIONS.map((opt) => (
            <option value={opt} className='capitalize' key={opt}>
              {opt.toUpperCase()}
            </option>
          ))}
        </select>
      </>
    )
  // this is for when someone views the task and may want to edit
  if (inputType === 'edit-options')
    return (
      <div className='flex flex-col gap-2'>
        <label className=' text-white font-semibold' htmlFor={labelText}>
          Status
        </label>

        <select onChange={e => changeTaskStatus?.(e)} className='p-2 rounded-md cursor-pointer'>
          <option value={task?.data?.status} defaultValue={task?.data?.status}>
            {task?.data?.status?.toUpperCase()}
          </option>
          {/* if the task status is not in the options, those are rendered so they can be selected later */}
          <option
            value={OPTIONS.filter((opt) => opt !== task?.data?.status)[0]}
          >
            {OPTIONS.filter(
              (opt) => opt !== task?.data?.status
            )[0].toUpperCase()}
          </option>
          <option
            value={OPTIONS.filter((opt) => opt !== task?.data?.status)[1]}
          >
            {OPTIONS.filter(
              (opt) => opt !== task?.data?.status
            )[1].toUpperCase()}
          </option>
        </select>
      </div>
    )

  // when not editing the board its the add task form
  if (name === 'board' && !isEditingBoard)
    return (
      <div className='bg-cyan-600 p-4 shadow-lg relative bottom-8 md:bottom-12 2xl:bottom-2'>
        <div className={`flex items-center gap-2 pl-6 board-input relative`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {errors.boardName?.message ? (
              <p
                className={`text-sm text-red-600 bg-white ${errors && 'p-2'
                  } absolute bottom-11`}
              >
                {errors.boardName?.message}
              </p>
            ) : (
              ''
            )}
            <input
              autoFocus
              className='rounded h-10 pl-2 w-52'
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
            type='cross'
            onClick={() => {
              setCreateNewBoard(false)
            }}
          />
        </div>
        {createBoardInputHasValue && (
          <button
            onClick={handleSubmit(onSubmit)}
            className='font-thin text-white bg-cyan-400 p-2 rounded-3xl relative left-6 top-2'
          >
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
         pl-6 board-input relative`}
      >
        <form onSubmit={editBoardSubmit(onEditBoardNameSubmit)}>
          {errors.boardName?.message ? (
            <p
              className={`text-sm text-red-600 bg-white ${errors && 'p-2'
                } absolute bottom-11`}
            >
              {errors.boardName?.message}
            </p>
          ) : (
            ''
          )}
          <input
            defaultValue={board?.data.boardName}
            autoFocus
            className='rounded h-6 sm:h-10 pl-2 w-32 sm:w-96 text-black text-sm'
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
        <div className='flex justify-between'>
          <label className='font-thin text-white' htmlFor={labelText}>
            {labelText}
          </label>
          {/* if password has value, show the show password checkbox */}
          {name === 'password' && passwordHasValues && <div className='text-xs sm:text-sm flex items-center text-white gap-2'>
            <label className='font-thin' htmlFor="checkbox">Show Password</label>
            <input className='cursor-pointer' onChange={(e) =>
              e.target.checked ? setShowPassword!(true) : setShowPassword!(false)
            } type='checkbox' />
          </div>}
        </div>
        <input
          onChange={(e) => {
            name === 'password' && e.target.value ? setPasswordHasValues(true) : setPasswordHasValues(false)
          }}
          autoFocus={page === 'login' ? name === "email" : name === 'name'}
          className='rounded h-12 pl-2 w-full sm:w-96 m-auto'
          required={required}
          type={type}
          name={name}
          placeholder={placeholder}
        />
      </>
    )

  return (
    <div className='flex flex-col w-full'>
      <label className='font-thin text-white' htmlFor={labelText}>
        {labelText}
      </label>

      {labelText === 'Description' ? (
        <textarea
          defaultValue={name && defaultValue}
          {...register?.('description')}
          placeholder={placeholder}
          className='h-32 rounded pl-2 pt-1 w-full resize-none'
        ></textarea>
      ) : (
        <input
          defaultValue={name && defaultValue}
          autoFocus={name === 'title' && true}
          className={`rounded h-12 pl-2 w-full ${name === 'subtask2' && 'animate-fade animate-duration-500'} `}
          required={required}
          {...register?.(name as 'name' | 'title' | 'description' | 'subtask1' | 'subtask2' | 'status')}
          type={type}
          name={name}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
export default FormRow
