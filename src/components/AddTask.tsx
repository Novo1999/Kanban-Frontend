import { useEffect, useState } from 'react'
import { Button, FormRow, Overlay } from '.'
import { useCreateTask } from '../hooks/useCreateTask'
import { useKanban } from '../pages/KanbanBoard'

class SubtaskField {
  subtask: string
  constructor(subtask: string) {
    this.subtask = subtask
  }
}


const AddTask = () => {
  const { register, handleSubmit, onSubmit, watch, resetField, setValue } =
    useCreateTask()
  const { setShowAddNewModal } = useKanban()
  const [subtaskFields, setSubtaskFields] = useState<SubtaskField[]>([new SubtaskField('')])
  console.log("🚀 ~ AddTask ~ subtaskFields:", subtaskFields)

  const addSubtaskField = () =>
    setSubtaskFields(prev => [...prev, new SubtaskField('')])

  useEffect(() => {
    setValue('subtasks', subtaskFields.map(st => ({ subtask: st.subtask })))
  }, [subtaskFields, setValue])

  return (
    <Overlay>
      <section className='relative z-20 m-auto top-0 left-0 bottom-0 right-0 rounded-lg w-screen mx-4 sm:w-[29rem] p-10 h-fit bg-cyan-600 animate-jump-in animate-ease-in-out'>
        <div className='flex justify-between items-center mb-10'>
          <h3 className='text-xl text-white font-semibold'>Add New Task</h3>
          <Button
            type='cross'
            onClick={() => {
              setShowAddNewModal(false)
            }}
          />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-6'
        >
          <FormRow
            labelText='Title'
            type='text'
            name='title'
            register={register}
            placeholder='e.g. Take coffee break'
          />
          <FormRow
            labelText='Description'
            type='text'
            name='description'
            register={register}
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />
          <p className='font-thin text-white relative top-2'>SubTasks</p>
          <div className='flex gap-2 items-center flex-col'>
            {
              subtaskFields.map((_, index) => {
                return <div className="flex w-full">
                  <FormRow
                    onChange={e => setSubtaskFields(prev => {
                      const updatedSubtasks = [...prev]
                      updatedSubtasks[index].subtask = e.target.value
                      return updatedSubtasks
                    })}
                    key={`sub-${index}`}
                    type='text'
                    name={`subtask-${index}`}
                    register={register}
                    placeholder='e.g. Make coffee'
                    required={false}
                  />
                  {index > 0 && <Button onClick={() => setSubtaskFields(prev => {
                    return prev.filter((_, i) => index !== i)
                  })} type='cross' />}
                </div>

              })
            }

          </div>
          {subtaskFields[subtaskFields.length - 1].subtask && subtaskFields.length !== 5 ? (
            <Button
              onClick={addSubtaskField}
              type='subtask'
              buttonText='+add another subtask'
            />
          ) : (
            <div className='flex gap-2 items-center'>
              <FormRow
                type='text'
                name='subtask2'
                register={register}
                placeholder='e.g. Make coffee'
                required={false}
              />
              <Button onClick={() => {
                resetField('subtask2')
              }} type='cross' />
            </div>
          )}

          <FormRow
            register={register}
            type=''
            name='options'
            inputType='options'
          />
          <Button type='createNew' buttonText='create new task' />
        </form>
      </section>
    </Overlay>
  )
}
export default AddTask
