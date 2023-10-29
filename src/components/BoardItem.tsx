
import { Button, Status, Task } from '.'
import useGetBoard from '../hooks/useGetBoard'
import useWindowDimensions from '../hooks/useWindowDimension'
import { useKanban } from '../pages/KanbanBoard'

export type Board = {
  data: {
    data: {
      tasks: Array<{
        title: string
        subtasks: []
        _id: string
        status: string
      }>
    }
  }
  isLoading: boolean
}

const BoardItem = () => {
  const { data: board } = useGetBoard() as Board
  const { setShowAddNewModal } = useKanban()
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  const onTablet = windowDimensions.width > 760 && windowDimensions.width < 1000

  const setDevice = () => {
    if (onMobile) return 'mobile'
    if (onTablet) return 'tablet'
    else return 'pc'
  }

  return board?.data?.tasks?.length === 0 ? (
    <section className='flex justify-center h-96 items-center text-white text-4xl'>
      <div className='flex gap-12 items-center'>
        <p className='text-lg mt-3 sm:mt-0 sm:text-2xl'>No tasks in this board</p>
        <span>
          <Button
            onClick={() => {
              setShowAddNewModal(true)
            }}
            type='add'
            buttonText='+Add New Task'
          />
        </span>
      </div>
    </section>
  ) : (
    <TaskSection on={setDevice()} />
  )
}
export default BoardItem

const TaskSection = ({ on }: { on: string }) => {
  if (on === 'pc') {
    return (
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-2'>
        <Task statusType='task' />
        <Task statusType='in progress' />
        <Task statusType='completed' />
      </section>
    )
  }

  if (on === 'tablet') {
    return (
      <section className='grid grid-cols-1 mt-10 gap-2'>
        <Status type="task" />
        <Task statusType='task' />
        <Status type="in progress" />
        <Task statusType='in progress' />
        <Status type="completed" />
        <Task statusType='completed' />
      </section>
    )
  }

  if (on === 'mobile') {
    return (
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-10 gap-2'>
        <Status type="task" />
        <Task statusType='task' />
        <Status type="in progress" />
        <Task statusType='in progress' />
        <Status type="completed" />
        <Task statusType='completed' />
      </section>
    )
  }
}
