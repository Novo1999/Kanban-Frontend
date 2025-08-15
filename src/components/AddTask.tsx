import { ErrorMessage } from '@hookform/error-message'
import { useEffect, useState } from 'react'
import { Button, FormRow, Overlay } from '.'
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
      <section className="relative z-20 m-auto top-0 left-0 bottom-0 right-0 rounded-lg w-screen mx-4 sm:w-[29rem] p-10 max-h-[70vh] h-full xl:h-fit overflow-x-auto bg-white border border-gray-300 shadow-lg animate-jump-in animate-ease-in-out">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl text-black font-semibold">Add New Task</h3>
          <Button
            type="cross"
            onClick={() => {
              setShowAddNewModal(false)
            }}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="relative">
            <FormRow required labelText="Title" type="text" name="title" register={register} placeholder="e.g. Take coffee break" />
            <ErrorMessage errors={errors} name="title" render={({ message }) => <p className="absolute text-red-500 capitalize font-bold">{message}</p>} />
          </div>

          <FormRow
            labelText="Description"
            type="text"
            name="description"
            register={register}
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />
          <p className="font-thin text-black relative top-2">SubTasks</p>
          <div className="flex gap-2 items-center flex-col">
            {subtaskFields.map((_, index) => {
              return (
                <div key={index} className="flex w-full">
                  <FormRow
                    onChange={(e) =>
                      setSubtaskFields((prev) => {
                        const updatedSubtasks = [...prev]
                        updatedSubtasks[index].subtask = e.target.value
                        return updatedSubtasks
                      })
                    }
                    key={`sub-${index}`}
                    type="text"
                    name={`subtask-${index}`}
                    register={register}
                    placeholder="e.g. Make coffee"
                    required={false}
                  />
                  {index > 0 && (
                    <Button
                      onClick={() =>
                        setSubtaskFields((prev) => {
                          return prev.filter((_, i) => index !== i)
                        })
                      }
                      type="cross"
                    />
                  )}
                </div>
              )
            })}
          </div>
          {subtaskFields[subtaskFields.length - 1].subtask && <Button onClick={addSubtaskField} type="subtask" buttonText="+add another subtask" />}
          <label htmlFor="status" className="label flex flex-col items-start text-black gap-2">
            Status
            <select onChange={(e) => setValue('status', e.target.value)} className="select select-bordered w-full capitalize bg-white text-black border-gray-300">
              {STATUS.map((st) => (
                <option key={st} className="capitalize text-black">
                  {st}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="deadline" className="label flex flex-col items-start text-black gap-2">
            Deadline
            <input
              onChange={handleDeadlineChange}
              type="date"
              className="input input-primary w-full bg-white text-black border-gray-300"
              min={getTodayDate()} // This prevents selecting past dates in the date picker
            />
          </label>

          <label htmlFor="priority" className="label flex flex-col items-start text-black gap-2">
            Priority
            <select onChange={(e) => setValue('priority', e.target.value)} className="select select-bordered w-full bg-white text-black border-gray-300" defaultValue="medium">
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

          <Button type="createNew" buttonText="create new task" />
        </form>
      </section>
    </Overlay>
  )
}
export default AddTask
