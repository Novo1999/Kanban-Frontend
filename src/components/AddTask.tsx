import { ErrorMessage } from '@hookform/error-message'
import { useEffect, useState } from 'react'
import { HiPlus, HiTrash, HiX } from 'react-icons/hi'
import { Overlay } from '.'
import { STATUS } from '../constants'
import { useCreateTask } from '../hooks/useCreateTask'
import { useKanban } from '../pages/KanbanBoard'

class SubtaskField {
  subtask: string
  constructor(subtask: string) {
    this.subtask = subtask
  }
}

const AddTask = () => {
  const { register, handleSubmit, onSubmit, setValue, errors } = useCreateTask()
  const { setShowAddNewModal } = useKanban()
  const [subtaskFields, setSubtaskFields] = useState<SubtaskField[]>([new SubtaskField('')])

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const addSubtaskField = () => setSubtaskFields((prev) => [...prev, new SubtaskField('')])

  const removeSubtaskField = (index: number) => {
    setSubtaskFields((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value
    const todayDate = getTodayDate()

    // If selected date is less than today, set it to today
    if (selectedDate < todayDate) {
      setValue('deadline', todayDate)
      // Also update the input field visually
      e.target.value = todayDate
    } else {
      setValue('deadline', selectedDate)
    }
  }

  useEffect(() => {
    setValue(
      'subtasks',
      subtaskFields.map((st) => ({ subtask: st.subtask }))
    )
  }, [subtaskFields, setValue])

  return (
    <Overlay>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-down animate-once animate-duration-[400ms]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Create New Task</h3>
            <button onClick={() => setShowAddNewModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <HiX className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register('title')}
                    type="text"
                    placeholder="e.g. Take coffee break"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
                  />
                  <ErrorMessage errors={errors} name="title" render={({ message }) => <p className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium">{message}</p>} />
                </div>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
                  Description
                </label>
                <textarea
                  {...register('description')}
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
                    onChange={(e) => setValue('priority', e.target.value)}
                    defaultValue="medium"
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
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-semibold text-gray-900">
                  Initial Status
                </label>
                <div className="relative">
                  <select
                    {...register('status')}
                    onChange={(e) => setValue('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white text-gray-900 appearance-none cursor-pointer capitalize"
                  >
                    {STATUS.map((st) => (
                      <option key={st} value={st} className="capitalize">
                        {st}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Deadline Field */}
              <div className="space-y-2">
                <label htmlFor="deadline" className="block text-sm font-semibold text-gray-900">
                  Deadline
                </label>
                <input
                  {...register('deadline')}
                  onChange={handleDeadlineChange}
                  type="date"
                  min={getTodayDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white text-gray-900"
                />
              </div>

              {/* Subtasks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-900">Subtasks</label>
                  <button
                    type="button"
                    onClick={addSubtaskField}
                    disabled={!subtaskFields[subtaskFields.length - 1]?.subtask}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    <HiPlus className="w-3 h-3" />
                    Add Subtask
                  </button>
                </div>

                <div className="space-y-3">
                  {subtaskFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.subtask}
                          onChange={(e) =>
                            setSubtaskFields((prev) => {
                              const updatedSubtasks = [...prev]
                              updatedSubtasks[index].subtask = e.target.value
                              return updatedSubtasks
                            })
                          }
                          placeholder="e.g. Make coffee"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>

                      {subtaskFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubtaskField(index)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-gray-500 flex items-center justify-center transition-colors"
                          title="Remove subtask"
                        >
                          <HiTrash className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {subtaskFields.length === 1 && !subtaskFields[0].subtask && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">Add subtasks to break down your task into smaller steps.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button type="button" onClick={() => setShowAddNewModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Overlay>
  )
}

export default AddTask
