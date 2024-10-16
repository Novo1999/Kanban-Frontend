/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { useDrag } from 'react-dnd'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import { FaClock, FaTrash } from 'react-icons/fa'
import { MdDragIndicator } from 'react-icons/md'
import { OPTIONS } from '../constants'
import useWindowDimensions from '../hooks/useWindowDimension'
import { useKanban } from '../pages/KanbanBoard'
import { editTaskStatus } from '../utils/editTaskStatus'
import DeleteTask from './DeleteTask'
import Overlay from './Overlay'
import { getFinalTime } from './TaskDetails'

type DraggableTaskProp = {
  id: string
  title: string
  subtasks: [{ name: string; status: string; _id: string }]
  status: string
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
  setDragCategory,
  statusType, setTasks, timeTracked
}: DraggableTaskProp) => {

  const { setIsTaskDetailsOpen, setShowDeleteTaskModal, showDeleteTaskModal, setSelectedTask, selectedBoard } = useKanban()
  const queryClient = useQueryClient()
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  // api patch request so the status of the tasks changes
  const changeTaskStatus = async (selectedTask: string, newStatus: string) => {
    const updatedStatus = { status: newStatus }
    await editTaskStatus(selectedBoard, selectedTask, updatedStatus)
    toast.success(
      `Moved to ${newStatus.slice(0, 1).toUpperCase() + newStatus.slice(1)}`
    )
    queryClient.invalidateQueries({ queryKey: ['selected-board'] })
  }
  // making the tasks draggable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { selectedTask: id },
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

      setTasks(prev => {
        const updatedTasks = [...prev]
        const matchedTaskIndex = updatedTasks.findIndex(task => task._id === selectedTask)
        if (matchedTaskIndex === -1) return
        updatedTasks[matchedTaskIndex].status = status
        return updatedTasks
      })
      changeTaskStatus(selectedTask, status)
    },
  }))

  // setting different task color
  const setTaskColor = () => {
    switch (status) {
      case OPTIONS[0]:
        return 'bg-sky-500'
      case OPTIONS[1]:
        return 'bg-purple-500'
      case OPTIONS[2]:
        return 'bg-teal-400'
    }
  }

  if (isDragging) {
    return <div ref={drag} />
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
        className={`mb-10 ${setTaskColor()} p-4 rounded-lg cursor-pointer flex items-center justify-between`}
      >

        <div className='break-all'>
          <h4 className='text-white font-semibold drop-shadow-lg'>{title}</h4>
          <p
            className={`${status === OPTIONS[2] ? 'text-gray-600' : 'text-gray-300'
              } font-medium drop-shadow-lg text-sm`}
          >
            {`${subtasks.length} subtasks(${subtasks.filter((subtask) => subtask.status === 'done').length
              } completed) `}
          </p>
        </div>
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <div onClick={e => {
              e.stopPropagation()
            }} className="tooltip tooltip-error" data-tip="Delete Task">
              <button onClick={() => {
                setSelectedTask(id)
                setShowDeleteTaskModal(true)
              }} className='btn btn-error text-white btn-sm mr-2'>
                <FaTrash />
              </button>
            </div>
            {!onMobile && (
              <div className='cursor-grab text-white'>
                <MdDragIndicator />
              </div>
            )}
          </div>
          <div className='text-black mr-2 text-xs gap-2 justify-between flex items-center mt-2'>
            <FaClock />
            {getFinalTime(timeTracked)}
          </div>
        </div>

      </div>
      {
        showDeleteTaskModal && createPortal(
          <Overlay>
            <DeleteTask setShowDeleteTask={setShowDeleteTaskModal} />
          </Overlay>
          , document.body)
      }
    </>
  )
}
export default DraggableTask
