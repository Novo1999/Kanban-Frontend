import { useKanban } from '../pages/KanbanBoard'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import customFetch from '../utils/customFetch'

const deleteBoard = async (
  id: string,
  client: {
    invalidateQueries: (arg: object) => void
    resetQueries: (arg: object) => void
  },
  navigate: (arg: string) => void,
  setter: (arg: boolean) => void
) => {
  try {
    await customFetch.delete(`/kanban/boards/${id}`)
    toast.success('Deleted Successfully')
    client.invalidateQueries({ queryKey: ['boards'] })
    navigate('/kanban')
    setter(false)
  } catch (error) {
    toast.error('Could not delete board')
  }
}

const deleteTask = async (boardId: string, taskId: string, client: { invalidateQueries: (arg: { queryKey: [value: string] }) => void }, setter: (isTaskDetailsOpen: boolean) => void) => {
  try {
    await customFetch.delete(`/kanban/boards/${boardId}/${taskId}`)
    toast.success('Deleted Successfully')
    client.invalidateQueries({ queryKey: ['selected-board'] })
    setter(false)
  } catch (error) {
    toast.error('Could not delete task')
  }
}


const DeleteModal = ({ type, setShowDeleteTask }: { type: string, setShowDeleteTask?: (isTaskDetailsOpen: boolean) => void }) => {
  const { setIsTaskDetailsOpen } = useKanban()
  const queryClient = useQueryClient()
  const { setShowDeleteBoardModal, selectedBoard, selectedTask } = useKanban()
  const navigate = useNavigate()
  if (type === 'board')
    return (
      <div className='bg-cyan-300 rounded-lg w-80 h-60 m-auto flex flex-col justify-center items-center relative shadow-xl animate-jump-in animate-ease-in-out'>
        <p className='font-semibold text-2xl'>Are you sure?</p>
        <div className='flex gap-10 mt-8'>
          <button
            onClick={() => {
              deleteBoard(
                selectedBoard,
                queryClient,
                navigate,
                setShowDeleteBoardModal
              )
            }}
            className='px-6 py-4 bg-green-500 rounded-xl text-white font-thin text-lg hover:scale-105 transition-all duration-200 shadow-md'
          >
            Yes
          </button>
          <button
            onClick={() => setShowDeleteBoardModal(false)}
            className='px-6 py-4 bg-red-500 rounded-xl text-white font-thin text-lg hover:scale-105 transition-all duration-200 shadow-md'
          >
            No
          </button>
        </div>
      </div>
    )

  if (type === 'task')
    return (
      <div className='bg-cyan-300 rounded-lg w-80 h-60 m-auto flex flex-col justify-center items-center relative shadow-xl animate-jump-in animate-ease-in-out'>
        <p className='font-semibold text-2xl'>Are you sure?</p>
        <div className='flex gap-10 mt-8'>
          <button
            onClick={() => {
              deleteTask(
                selectedBoard,
                selectedTask,
                queryClient,
                setIsTaskDetailsOpen
              )
            }}
            className='px-6 py-4 bg-green-500 rounded-xl text-white font-thin text-lg hover:scale-105 transition-all duration-200 shadow-md'
          >
            Yes
          </button>
          <button
            onClick={() => setShowDeleteTask?.(false)}
            className='px-6 py-4 bg-red-500 rounded-xl text-white font-thin text-lg hover:scale-105 transition-all duration-200 shadow-md'
          >
            No
          </button>
        </div>
      </div>
    )


}
export default DeleteModal