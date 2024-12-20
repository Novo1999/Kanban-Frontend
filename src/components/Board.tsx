import { motion } from 'framer-motion'
import { TfiLayoutMediaRightAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'

type BoardProp = {
  boardName: string
  boardId: string
  selectedBoard: string
  onClick: () => void
}

const Board = ({ boardName, boardId, selectedBoard, onClick }: BoardProp) => {
  const itemVariants = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
    },
  }

  return (
    <motion.div initial='closed' animate='open' variants={itemVariants}>
      <Link
        to={`/kanban/kanban-board/${boardId}`}
        onClick={onClick}
        className={`flex items-center gap-4 cursor-pointer pl-2 capitalize hover:bg-accent transition-all break-all duration-200 ${selectedBoard === boardId ? 'bg-neutral translate-x-[-15px]' : ''
          } hover:translate-x-[-15px]`}
      >
        <TfiLayoutMediaRightAlt className='text-white' />
        <p className='text-gray-200 py-4 font-semibold'>{boardName}</p>
      </Link>
    </motion.div>
  )
}
export default Board
