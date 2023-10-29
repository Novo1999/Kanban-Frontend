import { TfiLayoutMediaRightAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'

type BoardProp = {
  boardName: string
  boardId: string
  selectedBoard: string
  onClick: () => void
}

const Board = ({ boardName, boardId, selectedBoard, onClick }: BoardProp) => {
  return (
    <Link
      to={`/kanban/kanban-board/${boardId}`}
      onClick={onClick}
      className={`flex items-center gap-4 cursor-pointer pl-2 capitalize hover:bg-cyan-600 transition-all break-all duration-200 ${selectedBoard === boardId ? 'bg-cyan-600 translate-x-[-15px]' : ''
        } hover:translate-x-[-15px]`}
    >
      <TfiLayoutMediaRightAlt />
      <p className='text-gray-200 py-4 font-semibold'>{boardName}</p>
    </Link>
  )
}
export default Board
