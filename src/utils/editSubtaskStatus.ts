import toast from 'react-hot-toast'
import customFetch from './customFetch'

export const editSubtaskStatus = async (
  boardId: string,
  taskId: string,
  subtaskId: string,
  newStatus: { status: string }
) => {
  try {
    const updated = await customFetch.patch(
      `/kanban/boards/${boardId}/tasks/${taskId}/edit-subtask/${subtaskId}`,
      newStatus
    )
    return updated
  } catch (error) {
    toast.error('Something went wrong')
  }
}
