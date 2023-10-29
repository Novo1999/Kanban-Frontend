import customFetch from './customFetch'

export const getBoard = async (id: string) => {
  // if no board id, dont send any request
  if (!id) return null
  try {
    const data = await customFetch.get(`/kanban/boards/${id}`)
    return data
  } catch (error) {
    return null
  }
}
