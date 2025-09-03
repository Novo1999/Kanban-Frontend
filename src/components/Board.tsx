import { motion } from 'framer-motion'
import { TfiLayoutMediaRightAlt } from 'react-icons/tfi'
import { useLoaderData } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'

type BoardProp = {
  boardName: string
  boardId: string
  selectedBoard: string
  onClick: () => void
  createdBy: { avatarUrl: string; name: string; _id: string } | undefined
}

// Alternative with more customization options:
const Board = ({ boardName, boardId, selectedBoard, onClick, createdBy }: BoardProp) => {
  const user = useLoaderData() as { name: string; email: string; avatarUrl: string; _id: string }
  const itemVariants = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
    },
  }
  const tooltipId = `advanced-tooltip-${boardId}-${createdBy?._id}`

  return (
    <motion.div className="overflow-visible" initial="closed" animate="open" variants={itemVariants}>
      <div
        onClick={onClick}
        className={`flex overflow-visible items-center gap-4 cursor-pointer pl-2 capitalize hover:btn-color hover:text-white transition-all break-all duration-200 ${
          selectedBoard === boardId ? 'btn-color translate-x-[-15px] text-white' : 'text-black'
        } hover:translate-x-[-15px]`}
      >
        <TfiLayoutMediaRightAlt className="text-black" />
        <p className="py-4 font-semibold">{boardName}</p>
        {user?._id !== createdBy?._id ? (
          <>
            <div className="avatar" data-tooltip-id={tooltipId}>
              <div className="w-6 rounded-full">
                <img
                  src={createdBy?.avatarUrl || 'https://static.vecteezy.com/system/resources/previews/011/212/563/non_2x/avatar-character-or-user-free-vector.jpg'}
                  alt={`${createdBy?.name} avatar`}
                />
              </div>
            </div>

            {/* Advanced React Tooltip with custom content */}
            <Tooltip
              id={tooltipId}
              place="top"
              className="!bg-gray-800 !text-white !text-sm !px-2 !py-1 !rounded !shadow-lg"
              style={{ zIndex: 9999 }}
              delayShow={200}
              delayHide={100}
              offset={8}
              opacity={1}
            >
              <div className="text-center">
                <div className="font-medium">{createdBy?.name}</div>
                <div className="text-xs text-gray-300">Board Creator</div>
              </div>
            </Tooltip>
          </>
        ) : null}
      </div>
    </motion.div>
  )
}

export default Board
