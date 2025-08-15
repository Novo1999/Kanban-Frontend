import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { useKanban } from '../pages/KanbanBoard'
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

const DeleteModal = ({ type, setShowDeleteTask }: { type: string; setShowDeleteTask?: (isTaskDetailsOpen: boolean) => void }) => {
  const { setIsTaskDetailsOpen, setSelectedTask } = useKanban()
  const queryClient = useQueryClient()
  const { setShowDeleteBoardModal, selectedBoard, selectedTask } = useKanban()
  const navigate = useNavigate()

  const handleClose = () => {
    if (type === 'board') setShowDeleteBoardModal(false)
    if (type === 'task') {
      setSelectedTask('')
      setShowDeleteTask?.(false)
    }
  }

  const handleConfirm = () => {
    if (type === 'board') {
      deleteBoard(selectedBoard, queryClient, navigate, setShowDeleteBoardModal)
    } else if (type === 'task') {
      deleteTask(selectedBoard, selectedTask, queryClient, setIsTaskDetailsOpen)
      setSelectedTask('')
      setShowDeleteTask?.(false)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-accent">
        <h3 className="font-bold text-lg text-center text-black">Are you sure?</h3>
        <p className="py-4 text-center text-black">{type === 'board' ? 'This action will delete the board and all its tasks.' : 'This action will delete the task permanently.'}</p>
        <div className="modal-action justify-center gap-4">
          <button onClick={handleConfirm} className="btn btn-success hover:scale-105 transition-transform">
            Yes
          </button>
          <button onClick={handleClose} className="btn btn-error hover:scale-105 transition-transform">
            No
          </button>
        </div>
      </div>
    </div>
  )
}
export default DeleteModal
