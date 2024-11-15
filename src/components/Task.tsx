import { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import useGetBoard from '../hooks/useGetBoard'
import { DraggableTask, Spinner } from './index'

const Task = ({ statusType }: { statusType: string }) => {
  const { data: board, isLoading } = useGetBoard()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tasks, setTasks] = useState<any>()


  useEffect(() => {
    if (!board) return
    if (!board?.data?.tasks) return

    setTasks(board?.data?.tasks)
  }, [board?.data?.tasks, board])

  // state for ui changes
  const [dragCategory, setDragCategory] = useState('')

  // task container is the drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: () => ({ status: statusType }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  // container style
  const taskContainerStyle = `p-4 transition-colors duration-300 ${isOver && dragCategory === statusType &&
    'animate-pulse animate-duration-500 bg-accent border-4'
    } ${dragCategory === statusType
      ? 'border-2 border-neutral border-opacity-80 min-h-[20rem]'
      : dragCategory !== statusType
        ? 'border-2 border-neutral min-h-[20rem]'
        : ''
    } rounded-xl`


  return isLoading ? (
    <div className='flex justify-center items-center min-h-[35rem]'>
      <Spinner />
    </div>
  ) : (
    <div ref={drop} className={taskContainerStyle}>
      {/* destructured tasks properties */}
      {tasks?.map(
        ({
          title,
          subtasks,
          _id: id,
          status,
          timeTracked
        }: {
          title: string
          subtasks: [{ name: string; status: string; _id: string }]
          _id: string
          status: string
          timeTracked: number
        }) => {
          if (status === statusType) {
            return (
              <DraggableTask
                setTasks={setTasks}
                key={id}
                id={id}
                title={title}
                subtasks={subtasks}
                status={status}
                setDragCategory={setDragCategory}
                statusType={statusType}
                timeTracked={timeTracked}
              />
            )
          }
        }
      )}
    </div>
  )
}
export default Task
