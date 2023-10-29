import { useState } from 'react'
import { useForm } from 'react-hook-form'
import customFetch from '../utils/customFetch'

import toast from 'react-hot-toast'
import { useKanban } from '../pages/KanbanBoard'
import { useQueryClient } from '@tanstack/react-query'
import { IFormValues } from '../components/FormRow'

export const useEditTask = () => {
  const queryClient = useQueryClient()
  const [subtaskField, setSubtaskField] = useState<boolean>(false)
  const { register, handleSubmit, watch, formState, reset } =
    useForm<IFormValues>()
  const { setShowAddNewModal, selectedTask, selectedBoard } = useKanban()

  const onSubmit: import('react-hook-form').SubmitHandler<IFormValues> = async (
    data
  ) => {
    const formData = {
      title: data.title,
      description: data.description,
      subtasks:
        data.subtask1 && data.subtask2
          ? [
              { name: data.subtask1 ? data.subtask1 : '' },
              { name: data.subtask2 ? data.subtask2 : '' },
            ]
          : data.subtask1
          ? [{ name: data.subtask1 ? data.subtask1 : '' }]
          : (data.subtask2 && [{ name: data.subtask2 ? data.subtask2 : '' }]) ||
            [],
      status: data.status,
    }
    try {
      await customFetch.patch(
        `/kanban/boards/${selectedBoard}/${selectedTask}`,
        formData
      )
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
    reset,
  }
}
