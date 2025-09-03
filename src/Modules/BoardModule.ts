import toast from 'react-hot-toast'
import customFetch from '../utils/customFetch'

export default class BoardModule {
  static async getAllBoards() {
    try {
      const res = await customFetch.get('/kanban/boards')
      return res?.data
    } catch (error) {
      return error
    }
  }

  static async createBoard(data: object) {
    try {
      await customFetch.post('/kanban/boards/create', data)
      toast.success('Board added successfully')
    } catch (error) {
      toast.error('An error occurred')
      return error
    }
  }

  static async getBoard(id: string) {
    try {
      const data = await customFetch.get(`/kanban/boards/${id}`)
      return data
    } catch (error) {
      return null
    }
  }

  static async editBoard(id: string, formData: FormData) {
    try {
      await customFetch.patch(`/kanban/boards/${id}`, formData)
      toast.success('Board name edited')
    } catch (error) {
      toast.error('Could not update board name')
    }
  }

  static async reorderBoard(
    changedOrder: {
      boardId: string
      order: number
    }[]
  ) {
    try {
      await customFetch.patch(`/kanban/boards/reorder`, { data: changedOrder })

      toast.success('Board order changed')
    } catch (error) {
      toast.error('Could not update board order')
    }
  }
}
