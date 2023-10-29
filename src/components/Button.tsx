import { TfiLayoutMediaRightAlt } from 'react-icons/tfi'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { BsArrowRightSquare, BsThreeDotsVertical } from 'react-icons/bs'
import { FiEdit3 } from 'react-icons/fi'
import { BiHide } from 'react-icons/bi'
import { RxCross2 } from 'react-icons/rx'
import { useKanban } from '../pages/KanbanBoard'
import { SetStateAction } from 'react'

type ButtonProp = {
  type: string
  buttonText?: string
  onClick?: () => boolean | void
  setIsEditingBoard?: React.Dispatch<SetStateAction<boolean>>
  isEditingBoard?: boolean
  setIsEditingTask?: (arg: boolean) => boolean | void
  setShowDeleteTask?: (arg: boolean) => boolean | void
}

const Button = ({
  type,
  buttonText,
  setIsEditingBoard,
  onClick,
  isEditingBoard,
  setIsEditingTask,
  setShowDeleteTask
}: ButtonProp) => {
  const { setShowDeleteBoardModal } = useKanban()
  switch (type) {
    case 'option-menu':
      return (
        !isEditingBoard && (
          <div className='absolute w-40 h-30 flex p-2 items-center flex-col text-lg bg-cyan-500 top-20 right-14 rounded option-menu'>
            <button
              onClick={() => setIsEditingBoard!(true)}
              className='border-b-2 w-40 flex justify-center items-center gap-1'
            >
              <FiEdit3 />
              Edit
            </button>

            <button
              onClick={() => setShowDeleteBoardModal(true)}
              className=' w-40 flex justify-center items-center gap-1'
            >
              <RiDeleteBin2Line />
              Delete
            </button>
          </div>
        )
      )

    case 'task-option':
      return (
        !isEditingBoard && (
          <div className='absolute w-40 h-30 flex p-2 items-center flex-col text-lg bg-cyan-400 shadow-lg top-16 right-14 rounded option-menu'>
            <button
              onClick={() => {
                setIsEditingTask!(true)
              }}
              className='border-b-2 w-40 flex justify-center items-center gap-1'
            >
              <FiEdit3 />
              Edit
            </button>

            <button
              onClick={() => setShowDeleteTask!(true)}
              className=' w-40 flex justify-center items-center gap-1'
            >
              <RiDeleteBin2Line />
              Delete
            </button>
          </div>
        )
      )

    case 'option':
      return (
        <button onClick={onClick} type='button' className='option-menu'>
          {buttonText} <BsThreeDotsVertical />
        </button>
      )

    case 'add':
      return (
        <button
          onClick={onClick}
          className='text-blue-100 bg-cyan-600 hover:bg-blue-400 hover:text-white font-bold px-2 py-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-lg transition-all duration-300'
          type='submit'
        >
          {buttonText}
        </button>
      )

    case 'show':
      return (
        <button
          className='text-4xl left-0 z-20 hover:text-white transition-all fixed duration-300 '
          onClick={onClick}
        >
          <BsArrowRightSquare />
        </button>
      )

    case 'hide':
      return (
        <button
          onClick={onClick}
          className='text-slate-300 top-2 relative hover:text-slate-400 font-bold py-2 w-fit h-fit px-4 rounded-full transition-all duration-300 flex gap-2 items-center'
          type='button'
        >
          <BiHide />
          {buttonText}
        </button>
      )

    case 'createBoard':
      return (
        <button
          onClick={onClick}
          className={`text-blue-300 hover:text-blue-400 bg-cyan-700 w-fit font-bold py-2 mt-6 ml-2 px-4 rounded-full mx-auto transition-all duration-300 flex gap-2 items-center board-input`}
          type='submit'
        >
          <TfiLayoutMediaRightAlt />
          {buttonText}
        </button>
      )

    case 'submit':
      return (
        <button
          onClick={onClick}
          className='bg-blue-500 hover:bg-blue-700 text-white flex justify-center font-bold py-3 px-16 rounded-full mt-6 w-24 mx-auto transition-all duration-300'
          type='submit'
        >
          {buttonText}
        </button>
      )

    case 'cross':
      return (
        <button
          onClick={onClick}
          type='button'
          className='text-xl relative text-white hover:rotate-90 transition-all'
        >
          <RxCross2 />
        </button>
      )

    case 'subtask':
      return (
        <button
          onClick={onClick}
          type='button'
          className='relative text-blue-400 transition-all capitalize text-md w-full bg-white p-3 rounded-3xl hover:bg-cyan-400 duration-300 hover:text-white'
        >
          {buttonText}
        </button>
      )

    case 'createNew':
      return (
        <button
          type='submit'
          className='relative text-white font-semibold transition-all capitalize text-md w-full bg-cyan-500 p-3 rounded-3xl hover:bg-white duration-300 hover:text-cyan-500'
        >
          {buttonText}
        </button>
      )
    default:
      null
  }
}
export default Button
