import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useKanban } from '../pages/KanbanBoard'
import customFetch from '../utils/customFetch'

interface IFormValues {
  title: string
  description: string
  status: string
  subtasks: Array<{ name: string }>
}

export const useEditTask = () => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, watch, resetField, setValue, formState } = useForm<IFormValues>()
  const { setShowAddNewModal, selectedTask, selectedBoard } = useKanban()
  const [subtaskField, setSubtaskField] = useState<boolean>(false)

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    const formData = {
      title: data.title,
      description: data.description,
      subtasks: data?.subtasks?.map(st => ({ name: st.name })) || [],
      status: data.status,
    }

    try {
      await customFetch.patch(`/kanban/boards/${selectedBoard}/${selectedTask}`, formData)
      queryClient.invalidateQueries({ queryKey: ['selected-board'] })
      setShowAddNewModal(false)
    } catch (error) {
      console.log(error)
      toast.error('Could not edit task')
    }
  }

  return {
    subtaskField,
    watch,
    setSubtaskField,
    register,
    handleSubmit,
    onSubmit,
    formState,
    resetField,
    setValue
  }
}
