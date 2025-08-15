/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import { FaClock, FaTrash } from 'react-icons/fa'
import { MdDragIndicator } from 'react-icons/md'
import { STATUS } from '../constants'
import useWindowDimensions from '../hooks/useWindowDimension'
import { useKanban } from '../pages/KanbanBoard'
import { editTaskStatus } from '../utils/editTaskStatus'
import { getPriorityConfig } from './CustomDragLayer'
import DeleteTask from './DeleteTask'
import Overlay from './Overlay'
import { getFinalTime } from './TaskDetails'

type DraggableTaskProp = {
  id: string
  title: string
  subtasks: [{ name: string; status: string; _id: string }]
  status: string
  priority?: string // Add priority prop
  setDragCategory: (arg: string) => string | void
  statusType: string
  setTasks: Dispatch<SetStateAction<any>>
  timeTracked: number
}

const DraggableTask = ({
  id,
  title,
  subtasks,
  status,
  priority = 'medium', // Default to medium priority
  setDragCategory,
  statusType,
  setTasks,
  timeTracked,
}: DraggableTaskProp) => {
  const { setIsTaskDetailsOpen, setShowDeleteTaskModal, showDeleteTaskModal, setSelectedTask, selectedBoard } = useKanban()
  const queryClient = useQueryClient()
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450

  // Get priority configuration
  const priorityConfig = getPriorityConfig(priority)

  // api patch request so the status of the tasks changes
  const changeTaskStatus = async (selectedTask: string, newStatus: string) => {
    const updatedStatus = { status: newStatus }
    await editTaskStatus(selectedBoard, selectedTask, updatedStatus)
    toast.success(`Moved to ${newStatus.slice(0, 1).toUpperCase() + newStatus.slice(1)}`)
    queryClient.invalidateQueries({ queryKey: ['selected-board'] })
  }

  // making the tasks draggable
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'task',
    item: {
      selectedTask: id,
      title,
      subtasks,
      status,
      priority,
      timeTracked,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const { selectedTask } = item
      // if dropped outside of the target, no request will happen
      if (!monitor.getDropResult()) return
      const { status }: { status: string } = monitor.getDropResult()!
      // if dropped on the same container, no request will happen
      if (status === statusType) return

      setTasks((prev) => {
        const updatedTasks = [...prev]
        const matchedTaskIndex = updatedTasks.findIndex((task) => task._id === selectedTask)
        if (matchedTaskIndex === -1) return prev
        updatedTasks[matchedTaskIndex].status = status
        return updatedTasks
      })
      changeTaskStatus(selectedTask, status)
    },
  }))

  // Hide default drag preview since we're using custom drag layer
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  // setting different task color
  const setTaskColor = () => {
    switch (status) {
      case STATUS[0]:
        return 'bg-blue-500 border border-accent shadow'
      case STATUS[1]:
        return 'bg-purple-500 border border-accent shadow'
      case STATUS[2]:
        return 'bg-teal-400 border border-accent shadow'
      default:
        return 'bg-gray-500 border border-accent shadow'
    }
  }

  return (
    <>
      <div
        ref={drag}
        onClick={() => {
          setIsTaskDetailsOpen(true)
          setSelectedTask(id)
        }}
        onDragStart={() => {
          setSelectedTask(id)
          setDragCategory(status)
        }}
        onDragEnd={() => {
          setDragCategory('')
        }}
        className={`mb-10 ${setTaskColor()} p-4 rounded-lg cursor-pointer flex items-center justify-between transition-opacity duration-200 ${isDragging ? 'opacity-30' : 'opacity-100'}`}
      >
        <div className="flex-1">
          {/* Priority Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig.color} text-black`}>
              {priorityConfig.emoji} {priorityConfig.label}
            </span>
          </div>

          <h4 className="text-black font-semibold drop-shadow-lg">{title}</h4>
          <p className={`${status === STATUS[2] ? 'text-gray-600' : 'text-gray-300'} font-medium drop-shadow-lg text-xs sm:text-sm`}>
            {`${subtasks.length} subtasks(${subtasks.filter((subtask) => subtask.status === 'done').length} completed) `}
          </p>
        </div>
        <div className="flex flex-col items-end flex-wrap">
          <div className="flex items-center flex-wrap">
            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="tooltip tooltip-error"
              data-tip="Delete Task"
            >
              <button
                onClick={() => {
                  setSelectedTask(id)
                  setShowDeleteTaskModal(true)
                }}
                className="btn btn-error text-black btn-sm mr-2"
              >
                <FaTrash />
              </button>
            </div>
            {!onMobile && (
              <div className="cursor-grab text-black">
                <MdDragIndicator />
              </div>
            )}
          </div>
          <div className="text-black mr-2 text-xs gap-2 justify-between flex items-center mt-2">
            <FaClock />
            {getFinalTime(timeTracked)}
          </div>
        </div>
      </div>
      {showDeleteTaskModal &&
        createPortal(
          <Overlay>
            <DeleteTask setShowDeleteTask={setShowDeleteTaskModal} />
          </Overlay>,
          document.body
        )}
    </>
  )
}

export default DraggableTask
