import customFetch from './customFetch'

export const getBoardTask = async (boardId: string, taskId: string) => {
  try {
    const task = await customFetch.get(
      `/kanban/boards/${boardId}/tasks/${taskId}`
    )
    if (!taskId || !boardId) return
    return task
  } catch (error) {
    return null
  }
}
