import { SetStateAction } from 'react'
import { BiHide } from 'react-icons/bi'
import { BsArrowRightSquare, BsThreeDotsVertical } from 'react-icons/bs'
import { FiEdit3 } from 'react-icons/fi'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { RxCross2 } from 'react-icons/rx'
import { TfiLayoutMediaRightAlt } from 'react-icons/tfi'
import { useKanban } from '../pages/KanbanBoard'

type ButtonProp = {
  type: string
  buttonText?: string
  onClick?: () => void
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
  setIsEditingTask,
  setShowDeleteTask,
}: ButtonProp) => {
  const { setShowDeleteBoardModal, isSidebarOpen } = useKanban()
  switch (type) {
    case 'option-menu':
      return (
        <ul className="menu dropdown-content rounded-box z-[1] w-52 p-2 shadow absolute top-20 right-16 bg-accent">
          <li>
            <button
              onClick={() => setIsEditingBoard?.(true)}
              className='w-full flex justify-center items-center gap-1 text-white p-3 text-lg'
            >
              <FiEdit3 />
              Edit
            </button>
          </li>
          <li>
            <button
              onClick={() => setShowDeleteBoardModal(true)}
              className='flex justify-center w-full items-center gap-1 text-white p-3 text-lg'
            >
              <RiDeleteBin2Line />
              Delete
            </button>
          </li>
        </ul>

      )

    case 'task-option':
      return (
        <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow absolute top-20 right-16">

          <li>
            <button
              onClick={() => {
                setIsEditingTask!(true)
              }}
              className='flex justify-center items-center gap-1 text-white'
            >
              <FiEdit3 />
              Edit
            </button>
          </li>

          <li>

            <button
              onClick={() => setShowDeleteTask!(true)}
              className=' flex justify-center items-center gap-1 text-white'
            >
              <RiDeleteBin2Line />
              Delete
            </button>
          </li>

        </ul>
      )


    case 'option':
      return (
        <div className="dropdown dropdown-bottom">
          <button
            onClick={onClick}
            type='button'
            className='option-menu text-white'
          >
            <summary className="btn m-1 pb-0 btn-sm bg-accent border-0 text-white hover:scale-105 hover:bg-accent">
              <BsThreeDotsVertical />
            </summary>
          </button>
        </div>

      )

    case 'add':
      return (
        <button
          onClick={onClick}
          className='text-blue-100 bg-accent hover:scale-105 hover:text-white font-bold px-2 py-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-lg transition-all duration-300'
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
      return (isSidebarOpen &&
        <button
          onClick={onClick}
          className='text-white bg-accent top-2 relative hover:scale-105 font-bold py-2 w-fit h-fit px-4 rounded-full transition-all duration-300 flex gap-2 items-center'
          type='button'
        >
          <BiHide />
          {buttonText}
        </button>
      )

    case 'createBoard':
      return (isSidebarOpen &&
        <button
          onClick={onClick}
          className={`text-white hover:scale-105 bg-accent w-fit font-bold py-2 mt-6 ml-2 px-4 rounded-full mx-auto transition-all duration-300 flex gap-2 items-center board-input`}
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
