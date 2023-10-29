import { useKanban } from '../pages/KanbanBoard'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import customFetch from '../utils/customFetch'

type Input = {
  boardName: string
}

export const useCreateBoard = () => {
  const queryClient = useQueryClient()
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<Input>()

  const createBoard = async (data: object) => {
    try {
      await customFetch.post('/kanban/boards/create', data)
      toast.success('Board added successfully')
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    } catch (error) {
      toast.error('An error occurred')
      return error
    }
  }

  const { setCreateNewBoard } = useKanban()
  const onSubmit = async (data: object) => {
    await createBoard(data)
    reset()
    setCreateNewBoard(false)
  }

  return { handleSubmit, onSubmit, register, errors, watch }
}
