/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useParams } from 'react-router'
import { useKanban } from '../pages/KanbanBoard'
import customFetch from '../utils/customFetch'

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, watch, resetField, setValue } = useForm<any>()
  const { setShowAddNewModal } = useKanban()

  const { id } = useParams()

  const onSubmit: SubmitHandler<any> = async (
    data,
  ) => {
    const formData = {
      title: data.title,
      description: data.description,
      subtasks: data?.subtasks?.map(st => ({ name: st.subtask }))
      ,
      status: data.status,
    }
    try {
      await customFetch.patch(`/kanban/boards/${id}/create-task`, formData)
      queryClient.invalidateQueries({ queryKey: ['selected-board'] })
      setShowAddNewModal(false)
    } catch (error) {
      console.log(error)
      toast.error('Could not add task to board')
    }
  }
  return {
    watch,
    register,
    handleSubmit,
    onSubmit,
    resetField,
    setValue
  }
}
