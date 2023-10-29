import { useEffect } from 'react'
import { Button, FormRow, Spinner } from '.'
import { useEditTask } from '../hooks/useEditTask'
import { useGetTask } from '../hooks/useGetTask.js'
import { UseFormRegister } from 'react-hook-form'
import { IFormValues } from './FormRow'

const EditTask = ({
  setIsEditingTask,
}: {
  setIsEditingTask: (arg: boolean) => boolean | void
}) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    formState: { isSubmitted },
  } = useEditTask()

  const { data, isLoading: isTaskLoading } =
    useGetTask() as import('./TaskDetails').UseGetTask

  useEffect(() => {
    if (isSubmitted) setIsEditingTask(false)
  }, [isSubmitted, setIsEditingTask])

  return isTaskLoading ? (
    <Spinner />
  ) : (
    <section className='fixed w-80 z-20 m-auto top-0 left-0 bottom-0 right-0 rounded-lg sm:w-[29rem] p-10 h-fit bg-sky-600 shadow-xl animate-flip-down animate-once animate-duration-500'>
      <div className='flex justify-between items-center sm:mb-10'>
        <h3 className='text-xl text-white font-semibold'>Edit Task</h3>
        <Button
          type='cross'
          onClick={() => {
            setIsEditingTask(false)
          }}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <FormRow
          defaultValue={data.data.title}
          labelText='Title'
          type='text'
          name='title'
          register={register}
          placeholder='e.g. Take coffee break'
        />
        <FormRow
          defaultValue={data.data.description}
          labelText='Description'
          type='text'
          name='description'
          register={register}
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
        />
        <p className='font-thin text-white relative top-2'>SubTasks</p>
        <FormOrButton register={register} />
        <FormRow
          defaultValue={data.data.status}
          register={register}
          type=''
          name='options'
          inputType='options'
        />
        <Button type='createNew' buttonText='Done' />
      </form>
    </section>
  )
}
export default EditTask

const FormOrButton = ({
  register,
}: {
  register: UseFormRegister<IFormValues>
}) => {
  const { subtaskField, setSubtaskField, watch } = useEditTask()

  const { data } = useGetTask() as import('./TaskDetails').UseGetTask
  const subtask1HasText = watch('subtask1')?.length > 0

  if (data.data.subtasks.length === 2) {
    return (
      <>
        <FormRow
          defaultValue={data.data.subtasks[0]?.name}
          type='text'
          name='subtask1'
          register={register}
          placeholder='e.g. Make coffee'
          required={false}
        />
        <FormRow
          defaultValue={data.data.subtasks[1]?.name}
          type='text'
          name='subtask2'
          register={register}
          placeholder='e.g. Make coffee'
          required={false}
        />
      </>
    )
  }

  if (data.data.subtasks.length === 1 && !subtaskField) {
    return (
      <>
        <FormRow
          defaultValue={data.data.subtasks[0]?.name}
          type='text'
          name='subtask1'
          register={register}
          placeholder='e.g. Make coffee'
          required={false}
        />
        <Button
          onClick={() => setSubtaskField(true)}
          type='subtask'
          buttonText='+add another subtask'
        />
      </>
    )
  }

  if (data.data.subtasks.length === 0 && !subtaskField) {
    return (
      <Button
        onClick={() => setSubtaskField(true)}
        type='subtask'
        buttonText='+add subtask'
      />
    )
  }

  if (data.data.subtasks.length === 0 && subtaskField) {
    return (
      <FormRow
        defaultValue={data.data.subtasks[0]?.name}
        type='text'
        name='subtask1'
        register={register}
        placeholder='e.g. Make coffee'
        required={false}
      />
    )
  }

  if (data.data.subtasks.length === 0 && subtask1HasText) {
    return (
      <>
        <FormRow
          defaultValue={data.data.subtasks[0]?.name}
          type='text'
          name='subtask1'
          register={register}
          placeholder='e.g. Make coffee'
          required={false}
        />
        <Button
          onClick={() => setSubtaskField(true)}
          type='subtask'
          buttonText='+add subtask'
        />
      </>
    )
  }

  if (data.data.subtasks.length === 1 && subtaskField) {
    return (
      <>
        <FormRow
          defaultValue={data.data.subtasks[0]?.name}
          type='text'
          name='subtask1'
          register={register}
          placeholder='e.g. Make coffee'
          required={false}
        />
        <FormRow
          defaultValue={data.data.subtasks[1]?.name}
          type='text'
          name='subtask2'
          register={register}
          placeholder='e.g. Make coffee'
          required={false}
        />
      </>
    )
  }
}
