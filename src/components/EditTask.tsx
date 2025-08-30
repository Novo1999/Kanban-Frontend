import { ChangeEvent, useEffect, useState } from 'react'
import { HiPlus, HiTrash, HiX } from 'react-icons/hi'
import { Overlay, Spinner } from '.'
import { useEditTask } from '../hooks/useEditTask'
import { useGetTask } from '../hooks/useGetTask'

class SubtaskField {
  subtask: string
  status: string
  id: string
  constructor(id: string, subtask: string, status: string) {
    this.subtask = subtask
    this.status = status
    this.id = id
  }
}

const EditTask = ({ setIsEditingTask }: { setIsEditingTask: (arg: boolean) => boolean | void }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    setValue,
    formState: { isSubmitted },
  } = useEditTask()

  const { data, isLoading: isTaskLoading } = useGetTask()
  const [subtaskFields, setSubtaskFields] = useState<SubtaskField[]>([])

  // Initialize the subtask fields based on the fetched data
  useEffect(() => {
    if (data && data.data.subtasks) {
      setSubtaskFields(data.data.subtasks.map((st) => new SubtaskField(st._id, st.name, st.status)))
    }
  }, [])

  // Update the form's "subtasks" field whenever subtaskFields state changes
  useEffect(() => {
    setValue(
      'subtasks',
      subtaskFields.map((st) => ({ name: st.subtask, status: st.status }))
    )
  }, [subtaskFields, setValue])

  // Close the edit modal if the form is successfully submitted
  useEffect(() => {
    if (isSubmitted) setIsEditingTask(false)
  }, [isSubmitted, setIsEditingTask])

  // Add a new empty subtask field
  const addSubtaskField = () => {
    setSubtaskFields((prev) => [...prev, new SubtaskField(crypto.randomUUID(), '', 'undone')])
  }

  // Remove subtask field
  const removeSubtaskField = (fieldId: string) => {
    setSubtaskFields((prev) => prev.filter((st) => st.id !== fieldId))
  }

  // Get priority configuration for display
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { label: 'High Priority', color: 'text-red-600', emoji: '🔴' }
      case 'medium':
        return { label: 'Medium Priority', color: 'text-yellow-600', emoji: '🟡' }
      case 'low':
        return { label: 'Low Priority', color: 'text-green-600', emoji: '🟢' }
      default:
        return { label: 'Medium Priority', color: 'text-yellow-600', emoji: '🟡' }
    }
  }

  return isTaskLoading ? (
    <Spinner />
  ) : (
    <Overlay>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-down animate-once animate-duration-[400ms]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Edit Task</h3>
            <button onClick={() => setIsEditingTask(false)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <HiX className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
                  Task Title
                </label>
                <input
                  {...register('title')}
                  defaultValue={data?.data.title}
                  type="text"
                  placeholder="e.g. Take coffee break"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  defaultValue={data?.data.description}
                  placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white text-gray-900 placeholder-gray-500 resize-none"
                />
              </div>

              {/* Priority Selection */}
              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-900">
                  Priority Level
                </label>
                <div className="relative">
                  <select
                    {...register('priority')}
                    defaultValue={data?.data.priority || 'medium'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="high">🔴 High Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="low">🟢 Low Priority</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Current Priority Display */}
                {data?.data.priority && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600">Current priority:</span>
                    <span className={`font-medium text-sm ${getPriorityConfig(data.data.priority).color}`}>
                      {getPriorityConfig(data.data.priority).emoji} {getPriorityConfig(data.data.priority).label}
                    </span>
                  </div>
                )}
              </div>

              {/* Subtasks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-900">Subtasks</label>
                  <button
                    type="button"
                    onClick={addSubtaskField}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <HiPlus className="w-3 h-3" />
                    Add Subtask
                  </button>
                </div>

                <div className="space-y-3">
                  {subtaskFields.map((field) => (
                    <div key={`sub-${field.id}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.subtask}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setSubtaskFields((prev) => {
                              const updatedSubtasks = [...prev]
                              const fieldIndex = updatedSubtasks.findIndex((f) => f.id === field.id)
                              if (fieldIndex !== -1) {
                                updatedSubtasks[fieldIndex].subtask = e.target.value
                              }
                              return updatedSubtasks
                            })
                          }}
                          placeholder="e.g. Make coffee"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>

                      {subtaskFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubtaskField(field.id)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-gray-500 flex items-center justify-center transition-colors"
                          title="Remove subtask"
                        >
                          <HiTrash className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {subtaskFields.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No subtasks added yet.</p>
                      <p className="text-xs mt-1">Click "Add Subtask" to create one.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Selection */}
              {/* Status Selection - Replace the current FormRow */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">Status</label>
                <div className="form-control">
                  <select {...register('status')} defaultValue={data?.data.status} className="select select-bordered w-full bg-white text-gray-900">
                    <option value="todo">To Do</option>
                    <option value="doing">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button type="button" onClick={() => setIsEditingTask(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Overlay>
  )
}

export default EditTask
