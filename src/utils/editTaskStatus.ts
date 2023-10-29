import toast from 'react-hot-toast'
import customFetch from './customFetch'

export const editTaskStatus = async (
  boardId: string,
  taskId: string,
  newStatus: { status: string }
) => {
  try {
    return await customFetch.patch(
      `/kanban/boards/${boardId}/${taskId}/change-status`,
      newStatus
    )
  } catch (error) {
    toast.error('Something went wrong')
  }
}
