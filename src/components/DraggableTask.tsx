import { useQueryClient } from '@tanstack/react-query'
import { useDrag } from 'react-dnd'
import { MdDragIndicator } from 'react-icons/md'
import { useKanban } from '../pages/KanbanBoard'
import useWindowDimensions from '../hooks/useWindowDimension'
import { editTaskStatus } from '../utils/editTaskStatus'
import toast from 'react-hot-toast'
import { OPTIONS } from '../constants'

type DraggableTaskProp = {
  id: string
  title: string
  subtasks: [{ name: string; status: string; _id: string }]
  status: string
  setDragCategory: (arg: string) => string | void
  statusType: string
}

const DraggableTask = ({
  id,
  title,
  subtasks,
  status,
  setDragCategory,
  statusType,
}: DraggableTaskProp) => {
  const { setIsTaskDetailsOpen, setSelectedTask, selectedBoard } = useKanban()
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
          className={`${
            status === OPTIONS[2] ? 'text-gray-600' : 'text-gray-300'
          } font-medium drop-shadow-lg text-sm`}
        >
          {`${subtasks.length} subtasks(${
            subtasks.filter((subtask) => subtask.status === 'done').length
          } completed) `}
        </p>
      </div>
      {!onMobile && (
        <div className='cursor-grab'>
          <MdDragIndicator />
        </div>
      )}
    </div>
  )
}
export default DraggableTask
