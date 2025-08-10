import { ChangeEvent, useEffect, useState } from 'react'
import { Button, FormRow, Overlay, Spinner } from '.'
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
    setSubtaskFields((prev) => [...prev, new SubtaskField(crypto.randomUUID(), '', '')])
  }

  // Get priority configuration for display
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { label: 'High Priority', color: 'text-red-500', emoji: '🔴' }
      case 'medium':
        return { label: 'Medium Priority', color: 'text-yellow-500', emoji: '🟡' }
      case 'low':
        return { label: 'Low Priority', color: 'text-green-500', emoji: '🟢' }
      default:
        return { label: 'Medium Priority', color: 'text-yellow-500', emoji: '🟡' }
    }
  }

  return isTaskLoading ? (
    <Spinner />
  ) : (
    <Overlay>
      <section className="fixed w-80 m-auto top-0 left-0 bottom-0 right-0 rounded-lg sm:w-[29rem] h-fit max-h-[50rem] p-10 bg-secondary shadow-xl animate-flip-down animate-once overflow-y-scroll animate-duration-500">
        <div className="flex justify-between items-center sm:mb-10">
          <h3 className="text-xl text-white font-semibold">Edit Task</h3>
          <Button type="cross" onClick={() => setIsEditingTask(false)} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormRow defaultValue={data?.data.title} labelText="Title" type="text" name="title" register={register} placeholder="e.g. Take coffee break" />
          <FormRow
            defaultValue={data?.data.description}
            labelText="Description"
            type="text"
            name="description"
            register={register}
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />

          {/* Priority Selection */}
          <div className="form-control">
            <label htmlFor="priority" className="label flex flex-col items-start text-white gap-2">
              <span className="label-text text-white font-medium">Priority</span>
              <select {...register('priority')} defaultValue={data?.data.priority || 'medium'} className="select select-bordered w-full bg-base-100 text-base-content">
                <option value="high" className="text-red-500 font-semibold">
                  🔴 High Priority
                </option>
                <option value="medium" className="text-yellow-500 font-semibold">
                  🟡 Medium Priority
                </option>
                <option value="low" className="text-green-500 font-semibold">
                  🟢 Low Priority
                </option>
              </select>
            </label>

            {/* Current Priority Display */}
            {data?.data.priority && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-base-content/70 text-white">Current:</span>
                <span className={`font-semibold ${getPriorityConfig(data.data.priority).color}`}>
                  {getPriorityConfig(data.data.priority).emoji} {getPriorityConfig(data.data.priority).label}
                </span>
              </div>
            )}
          </div>

          <p className="font-thin text-white relative top-2">SubTasks</p>
          <div className="flex gap-2 items-center flex-col">
            {subtaskFields.map((field, index) => (
              <div className="flex w-full" key={`sub-${index}`}>
                <FormRow
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setSubtaskFields((prev) => {
                      const updatedSubtasks = [...prev]
                      updatedSubtasks[index].subtask = e.target.value
                      return updatedSubtasks
                    })
                  }}
                  type="text"
                  name={`subtask-${index}`}
                  value={subtaskFields.find((f) => f.id === field.id)?.subtask}
                  register={register}
                  placeholder="e.g. Make coffee"
                  required={false}
                />
                {index > 0 && (
                  <Button
                    type="cross"
                    onClick={() => {
                      setSubtaskFields((prev) => prev.filter((st) => st.id !== field.id))
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          {subtaskFields.length < 5 && <Button onClick={addSubtaskField} type="subtask" buttonText="+add another subtask" />}
          <FormRow defaultValue={data?.data.status} register={register} type="" name="options" inputType="options" />
          <Button type="createNew" buttonText="Done" />
        </form>
      </section>
    </Overlay>
  )
}

export default EditTask
