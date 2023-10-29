import { Button, DeleteTask, EditTask, FormRow, Overlay, Spinner } from '.'
import { useGetTask } from '../hooks/useGetTask.js'
import { useKanban } from '../pages/KanbanBoard'
import { editSubtaskStatus } from '../utils/editSubtaskStatus'
import { useQueryClient } from '@tanstack/react-query'
import { editTaskStatus } from '../utils/editTaskStatus'
import { useRef, useState } from 'react'

export type UseGetTask = {
  data: {
    data: {
      title: string
      subtasks: Array<{
        _id: string
        status: string
        name: string
      }>
      description: string
      status: string
    }
  }
  isLoading: boolean
}

const TaskDetails = () => {
  const { data, isLoading: isTaskLoading } = useGetTask() as UseGetTask
  const { selectedBoard, selectedTask, setIsTaskDetailsOpen } = useKanban()
  const [isTaskOptionsOpen, setIsTaskOptionsOpen] = useState<boolean>(false)
  const [isEditingTask, setIsEditingTask] = useState<boolean>(false)
  const [showDeleteTask, setShowDeleteTask] = useState<boolean>(false)
  const queryClient = useQueryClient()

  // Change subtasks status
  const changeSubtaskStatus = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // if the checkbox is checked, status will become done or else it will become undone
    const updatedStatus = e.target.checked
      ? { status: 'done' }
      : { status: 'undone' }
    // await is necessary so the query client works
    await editSubtaskStatus(selectedBoard, selectedTask, id, updatedStatus)
    // updating the board and tasks remote state after changing subtask status
    queryClient.invalidateQueries({ queryKey: ['selected-task'] })
    queryClient.invalidateQueries({ queryKey: ['selected-board'] })
  }

  // Change tasks status
  const changeTaskStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    // getting the updated status from the dropdown
    const updatedStatus = { status: e.target.value }
    await editTaskStatus(selectedBoard, selectedTask, updatedStatus)
    queryClient.invalidateQueries({ queryKey: ['selected-board'] })
  }

  const taskContainerRef = useRef<HTMLDivElement | null>(null)

  // clicking on taskContainerRef will disable the option menu

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === taskContainerRef.current) {
      setIsTaskOptionsOpen(false)
      setIsEditingTask(false)
    }
  }

  return (
    <Overlay>
      {isTaskLoading ? (
        <Spinner />
      ) : (
        <div
          ref={taskContainerRef}
          onClick={handleContainerClick}
          className='bg-cyan-500 w-[35rem] mx-6 sm:mx-0 min-h-[50rem] animate-fade-down animate-once animate-duration-[400ms] animate-normal rounded-lg p-10 overflow-auto my-10'
        >
          {/* Shows the delete modal inside the task details */}
          {showDeleteTask ? (
            <DeleteTask setShowDeleteTask={setShowDeleteTask} />
          ) : isEditingTask ? (
            <EditTask setIsEditingTask={setIsEditingTask} />
          ) : (
            <>
              <div className='flex justify-between mb-10'>
                <h4 className='text-sm sm:text-2xl text-white font-semibold w-fit break-all'>
                  {data?.data?.title}
                </h4>
                {/* Three dot option button */}
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={() => setIsTaskOptionsOpen(!isTaskOptionsOpen)}
                    type='option'
                  />
                  <Button
                    onClick={() => setIsTaskDetailsOpen(false)}
                    type='cross'
                  />
                </div>
                {/* Option menu that contains edit and delete */}
                {isTaskOptionsOpen && (
                  <Button
                    setIsEditingTask={setIsEditingTask}
                    setShowDeleteTask={setShowDeleteTask}
                    type='task-option'
                  />
                )}
              </div>
              <p className='mb-4 w-fit text-slate-600'>
                {data?.data?.description}
              </p>
              <p className='mb-2 w-fit text-white'>Subtasks</p>
              {data?.data?.subtasks.map((task) => {
                const { _id: id, status, name } = task
                return (
                  <div
                    key={id}
                    className='flex gap-4 bg-cyan-300 mb-4 p-4 rounded-lg '
                  >
                    <input
                      onChange={(e) => {
                        changeSubtaskStatus(id, e)
                      }}
                      // if status is done then put a check
                      defaultChecked={status === 'done'}
                      type='checkbox'
                      name='status'
                      value={id}
                      className='w-6 cursor-pointer'
                    />
                    <p
                      className={`font-semibold text-lg ${
                        status === 'done' ? 'line-through' : ''
                      }`}
                    >
                      {name}
                    </p>
                  </div>
                )
              })}
              <FormRow
                changeTaskStatus={changeTaskStatus}
                type=''
                name='options'
                inputType='edit-options'
              />
            </>
          )}
        </div>
      )}
    </Overlay>
  )
}
export default TaskDetails
