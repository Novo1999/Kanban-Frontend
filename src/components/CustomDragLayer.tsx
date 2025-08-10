import { useDragLayer } from 'react-dnd'
import { FaClock } from 'react-icons/fa'
import { STATUS } from '../constants'
import { getFinalTime } from './TaskDetails'

// Priority utility functions
export const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'high':
      return {
        label: 'High',
        color: 'bg-red-500',
        emoji: '🔴',
      }
    case 'medium':
      return {
        label: 'Medium',
        color: 'bg-yellow-500',
        emoji: '🟡',
      }
    case 'low':
      return {
        label: 'Low',
        color: 'bg-green-500',
        emoji: '🟢',
      }
    default:
      return {
        label: 'Medium',
        color: 'bg-yellow-500',
        emoji: '🟡',
      }
  }
}

// Custom Drag Preview Component
const TaskDragPreview = ({
  title,
  subtasks,
  status,
  priority = 'medium',
  timeTracked,
}: {
  title: string
  subtasks: [{ name: string; status: string; _id: string }]
  status: string
  priority?: string
  timeTracked: number
}) => {
  const priorityConfig = getPriorityConfig(priority)

  const setTaskColor = () => {
    switch (status) {
      case STATUS[0]:
        return 'bg-blue-500 border border-accent shadow-2xl'
      case STATUS[1]:
        return 'bg-purple-500 border border-accent shadow-2xl'
      case STATUS[2]:
        return 'bg-teal-400 border border-accent shadow-2xl'
      default:
        return 'bg-gray-500 border border-accent shadow-2xl'
    }
  }

  return (
    <div className={`${setTaskColor()} p-4 rounded-lg flex items-center justify-between min-w-[280px] max-w-[320px] transform rotate-3 shadow-2xl border-2`}>
      <div className="break-all flex-1">
        {/* Priority Badge in drag preview */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig.color} text-white`}>
            {priorityConfig.emoji} {priorityConfig.label}
          </span>
        </div>

        <h4 className="text-white font-semibold drop-shadow-lg">{title}</h4>
        <p className={`${status === STATUS[2] ? 'text-gray-600' : 'text-gray-300'} font-medium drop-shadow-lg text-xs sm:text-sm`}>
          {`${subtasks.length} subtasks(${subtasks.filter((subtask) => subtask.status === 'done').length} completed)`}
        </p>
      </div>
      <div className="flex flex-col items-end ml-4">
        <div className="text-black text-xs gap-2 justify-between flex items-center">
          <FaClock />
          {getFinalTime(timeTracked)}
        </div>
      </div>
    </div>
  )
}

// Custom Drag Layer Component - ONLY RENDER THIS ONCE IN YOUR APP
export const CustomDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }))

  if (!isDragging || !currentOffset || !item) {
    return null
  }

  return (
    <div
      className="fixed pointer-events-none z-[9999] top-0 left-0"
      style={{
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
      }}
    >
      <TaskDragPreview title={item.title} subtasks={item.subtasks} status={item.status} priority={item.priority} timeTracked={item.timeTracked} />
    </div>
  )
}

export default CustomDragLayer
