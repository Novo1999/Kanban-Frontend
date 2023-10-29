import { Button, FormRow, Overlay } from '.'
import { useCreateTask } from '../hooks/useCreateTask'
import { useKanban } from '../pages/KanbanBoard'

const AddTask = () => {
  const { subtaskField, setSubtaskField, register, handleSubmit, onSubmit, watch, resetField } =
    useCreateTask()
  const { setShowAddNewModal } = useKanban()
  const subtask1HasText = watch('subtask1')?.length > 0
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
          <div className='flex gap-2 items-center'>
            <FormRow
              type='text'
              name='subtask1'
              register={register}
              placeholder='e.g. Make coffee'
              required={false}
            />
          </div>
          {!subtaskField ? subtask1HasText && (
            <Button
              onClick={() => setSubtaskField(true)}
              type='subtask'
              buttonText='+add another subtask'
            />
          ) : subtask1HasText && (
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
                setSubtaskField(false)
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
