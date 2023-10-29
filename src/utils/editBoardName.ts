import toast from 'react-hot-toast'
import customFetch from './customFetch'

export const editBoardName = async (
  id: string,
  formData: object,
  client: { invalidateQueries: (arg: { queryKey: [value: string] }) => void }
) => {
  try {
    await customFetch.patch(`/kanban/boards/${id}`, formData)
    client.invalidateQueries({ queryKey: ['boards'] })
    client.invalidateQueries({ queryKey: ['selected-board'] })
    toast.success('Board name edited')
  } catch (error) {
    toast.error('Could not update board name')
  }
}
