import { SetStateAction } from 'react'
import { BiHide } from 'react-icons/bi'
import { BsArrowRightSquare, BsThreeDotsVertical } from 'react-icons/bs'
import { CgBoard } from 'react-icons/cg'
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
  disabled?: boolean
}

const Button = ({ type, buttonText, setIsEditingBoard, onClick, setIsEditingTask, setShowDeleteTask, disabled }: ButtonProp) => {
  const { setShowDeleteBoardModal, isSidebarOpen } = useKanban()
  switch (type) {
    case 'option-menu':
      return (
        <ul className="menu dropdown-content rounded-box z-[1] w-52 p-2 shadow absolute top-20 right-16">
          <li className="mb-2">
            <button onClick={() => setIsEditingBoard?.(true)} className="w-full flex justify-center items-center gap-1 btn-color hover:btn-color p-3 text-lg">
              <FiEdit3 />
              Edit
            </button>
          </li>
          <li>
            <button onClick={() => setShowDeleteBoardModal(true)} className="flex justify-center w-full hover:btn-color items-center gap-1 btn-color p-3 text-lg">
              <RiDeleteBin2Line />
              Delete
            </button>
          </li>
        </ul>
      )

    case 'task-option':
      return (
        <ul className="menu dropdown-content rounded-box z-[1] w-52 p-2 shadow absolute top-20 right-16">
          <li className="mb-2">
            <button
              onClick={() => {
                setIsEditingTask!(true)
              }}
              className="flex justify-center items-center gap-1 btn-color hover:btn-color"
            >
              <FiEdit3 />
              Edit
            </button>
          </li>

          <li>
            <button onClick={() => setShowDeleteTask!(true)} className=" flex justify-center hover:btn-color items-center gap-1 btn-color">
              <RiDeleteBin2Line />
              Delete
            </button>
          </li>
        </ul>
      )

    case 'option':
      return (
        <div className="dropdown dropdown-bottom">
          <button onClick={onClick} type="button" className="option-menu rounded-lg btn-color">
            <summary className="btn m-1 pb-0 btn-sm border-0 btn-color hover:scale-105 hover:btn-color">
              <BsThreeDotsVertical />
            </summary>
          </button>
        </div>
      )

    case 'add':
      return (
        <button onClick={onClick} className="btn-color hover:scale-105 font-bold px-2 py-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-lg transition-all duration-300" type="submit">
          {buttonText}
        </button>
      )

    case 'show':
      return (
        <button className="text-4xl left-0 z-20 btn-color hover:opacity-80 transition-all fixed duration-300 " onClick={onClick}>
          <BsArrowRightSquare />
        </button>
      )

    case 'hide':
      return (
        isSidebarOpen && (
          <button onClick={onClick} className="btn-color top-2 relative hover:scale-105 font-bold py-2 w-fit h-fit px-4 rounded-full transition-all duration-300 flex gap-2 items-center" type="button">
            <BiHide />
            {buttonText}
          </button>
        )
      )

    case 'createBoard':
      return (
        isSidebarOpen && (
          <button
            onClick={onClick}
            className={`btn-color hover:scale-105 font-bold py-2 mt-6 px-4 rounded-full mx-auto w-full transition-all duration-300 flex gap-2 items-center board-input`}
            type="submit"
          >
            <TfiLayoutMediaRightAlt />
            {buttonText}
          </button>
        )
      )

    case 'submit':
      return (
        <button disabled={disabled} onClick={onClick} className="btn-color flex justify-center font-bold py-3 px-16 rounded-full mt-6 mx-auto transition-all duration-300" type="submit">
          {buttonText}
        </button>
      )

    case 'cross':
      return (
        <button onClick={onClick} type="button" className="text-xl relative btn-color hover:rotate-90 transition-all">
          <RxCross2 />
        </button>
      )

    case 'subtask':
      return (
        <button onClick={onClick} type="button" className="relative btn-color transition-all capitalize text-md w-full p-3 rounded-3xl hover:opacity-80 duration-300">
          {buttonText}
        </button>
      )

    case 'createNew':
      return (
        <button type="submit" className="relative btn-color font-semibold transition-all capitalize text-md w-full p-3 rounded-3xl hover:scale-[1.02] duration-300">
          {buttonText}
        </button>
      )
    case 'joinBoard':
      return (
        <button onClick={onClick} type="submit" className="btn-color hover:scale-105 font-bold py-2 px-4 rounded-full mx-auto w-full transition-all duration-300 flex gap-2 items-center board-input">
          <CgBoard />
          {buttonText}
        </button>
      )
    default:
      null
  }
}
export default Button
