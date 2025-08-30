import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { User } from '../components/Header'
import { useKanban } from '../pages/KanbanBoard'
import customFetch from '../utils/customFetch'

interface IFormValues {
  title?: string
  description?: string
  status?: string
  priority?: string // Add priority field
  subtasks: Array<{ name: string; status: string }>
  timeTracked?: number
  assigned?: { user: User; assignedBy: User }[]
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
      priority: data.priority || 'medium', // Include priority with default fallback
      subtasks: data?.subtasks?.map((st) => ({ name: st.name, status: st.status })) || [],
      status: data.status,
      timeTracked: data.timeTracked,
      assigned: data?.assigned,
    }

    try {
      const response = await customFetch.patch(`/kanban/boards/${selectedBoard}/${selectedTask}`, formData)
      queryClient.invalidateQueries({ queryKey: ['selected-board'] })
      queryClient.invalidateQueries({ queryKey: ['selected-task', selectedTask] })
      setShowAddNewModal(false)
      toast.success('Task updated successfully!')
      return response
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
    setValue,
  }
}
