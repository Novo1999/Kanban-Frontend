import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { BiReset } from 'react-icons/bi'
import { FaClock, FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
import { Button, DeleteTask, EditTask, FormRow, Overlay, Spinner } from '.'
import { useGetTask } from '../hooks/useGetTask.js'
import { useKanban } from '../pages/KanbanBoard'
import { editSubtaskStatus } from '../utils/editSubtaskStatus'
import { editTaskStatus } from '../utils/editTaskStatus'

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
  const [timer, setTimer] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showTimeTracker, setShowTimeTracker] = useState(false)
  const intervalId = useRef<number | null>(null);

  const startTimer = () => {
    setTimerRunning(true)
    intervalId.current = setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)
  }
  const stopTimer = () => {
    setTimerRunning(false)
    setTimer(timer)
    if (intervalId.current)
      clearInterval(intervalId.current)
  }

  const resetTimer = () => {
    setTimerRunning(false)
    setTimer(0)
    if (intervalId.current)
      clearInterval(intervalId.current)
  }


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

  const minutes = Math.floor(timer / 60)
  const seconds = timer - minutes * 60
  const hours = Math.floor(timer / 3600)

  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  const finalTime = str_pad_left(hours, '0', 2) + ":" + str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);

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
                    className='flex gap-4 bg-cyan-300 mb-4 p-4 rounded-lg'
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
                      className='checkbox checkbox-info w-6 cursor-pointer'
                    />

                    <p
                      className={`font-semibold text-black text-lg ${status === 'done' ? 'line-through' : ''
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
          <p className='text-black mt-6 font-semibold'>Track Time</p>
          <button onClick={() => setShowTimeTracker(!showTimeTracker)} className='btn btn-sm tooltip tooltip-bottom' data-tip="Start Counter">
            <FaClock />
          </button>
          {showTimeTracker && <div className='h-36 flex justify-center items-center text-black rounded-lg mt-4 flex-col gap-2'>
            <p className='text-xl'>{finalTime}</p>
            <div className='flex gap-2 text-3xl'>
              <motion.button {...timerRunning && { whileTap: { scale: 1.2 } }} disabled={!timerRunning} onClick={stopTimer} className='tooltip tooltip-bottom' data-tip="Pause">
                <FaPauseCircle />
              </motion.button>
              <motion.button whileTap={{ scale: 1.2 }} disabled={timerRunning} onClick={startTimer} className='tooltip tooltip-bottom' data-tip="Play">
                <FaPlayCircle />
              </motion.button>
              <motion.button whileTap={{ scale: 1.2 }} onClick={resetTimer} className='tooltip tooltip-bottom' data-tip="Reset">
                <BiReset />
              </motion.button>
            </div>
          </div>}
        </div>
      )}
    </Overlay>
  )
}
export default TaskDetails
