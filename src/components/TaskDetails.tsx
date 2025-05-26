import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BiReset } from 'react-icons/bi'
import { FaCheckCircle, FaClock, FaPauseCircle, FaPlayCircle, FaPlusCircle } from 'react-icons/fa'
import { Button, DeleteTask, EditTask, FormRow, Overlay, Spinner } from '.'
import { useEditTask } from '../hooks/useEditTask.js'
import { useGetTask } from '../hooks/useGetTask.js'
import { useKanban } from '../pages/KanbanBoard'
import { editSubtaskStatus } from '../utils/editSubtaskStatus'
import { editTaskStatus } from '../utils/editTaskStatus'

export type UseGetTask = {
  data: {
    data: {
      _id: string
      title: string
      subtasks: Array<{
        _id: string
        status: string
        name: string
      }>
      description: string
      status: string
      timeTracked: number
      deadline: string | null
    }
  }
  isLoading: boolean
}

const TaskDetails = () => {
  const { data, isLoading: isTaskLoading } = useGetTask() as UseGetTask
  const { selectedBoard, selectedTask, setIsTaskDetailsOpen } = useKanban()
  const [isTaskOptionsOpen, setIsTaskOptionsOpen] = useState<boolean>(false)
  const [isEditingTask, setIsEditingTask] = useState<boolean>(false)
  const [subtaskEditLoading, setSubtaskEditLoading] = useState('')
  const [showDeleteTask, setShowDeleteTask] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const [timer, setTimer] = useState<number | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showTimeTracker, setShowTimeTracker] = useState(false)
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [subtaskInput, setSubtaskInput] = useState('')
  const intervalId = useRef<number | null>(null)

  const { onSubmit } = useEditTask()

  useEffect(() => {
    if (!data?.data) return
    if (!data?.data?._id) return

    if (timer === null) setTimer(data?.data?.timeTracked || 0)
  }, [data])

  const startTimer = () => {
    setTimerRunning(true)
    intervalId.current = setInterval(() => {
      setTimer((prev) => (prev || 0) + 1)
    }, 1000)
  }
  const stopTimer = () => {
    setTimerRunning(false)
    setTimer(timer)
    if (intervalId.current) clearInterval(intervalId.current)
    if (timerRunning) onSubmit({ ...data?.data, timeTracked: timer || 0 })
  }

  const resetTimer = () => {
    setTimerRunning(false)
    setTimer(0)
    if (intervalId.current) clearInterval(intervalId.current)
    onSubmit({ ...data?.data, timeTracked: 0 })
  }

  // Change subtasks status
  const changeSubtaskStatus = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    // if the checkbox is checked, status will become done or else it will become undone
    const updatedStatus = e.target.checked ? { status: 'done' } : { status: 'undone' }
    // await is necessary so the query client works
    setSubtaskEditLoading(id)
    const res = await editSubtaskStatus(selectedBoard, selectedTask, id, updatedStatus)
    if (res?.data?.msg) {
      // updating the board and tasks remote state after changing subtask status
      queryClient.invalidateQueries({ queryKey: ['selected-task'] })
    }
    setSubtaskEditLoading('')
    queryClient.invalidateQueries({ queryKey: ['selected-board'] })
  }

  // Change tasks status
  const changeTaskStatus = async (newStatus: string) => {
    // getting the updated status from the dropdown
    const updatedStatus = { status: newStatus }
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

  const handleAddSubtask = async () => {
    await onSubmit({ subtasks: [...data.data.subtasks, { name: subtaskInput, status: 'undone' }] })
    queryClient.invalidateQueries({ queryKey: ['selected-task'] })
    setSubtaskInput('')
    setIsAddingSubtask(false)
  }

  return (
    <Overlay>
      {isTaskLoading ? (
        <Spinner />
      ) : (
        <div
          ref={taskContainerRef}
          onClick={handleContainerClick}
          className="bg-secondary w-[35rem] max-h-[70vh] mx-6 sm:mx-0 h-[50rem] animate-fade-down animate-once animate-duration-[400ms] animate-normal rounded-lg p-10 overflow-y-scroll my-10"
        >
          {/* Shows the delete modal inside the task details */}
          {showDeleteTask ? (
            <DeleteTask setShowDeleteTask={setShowDeleteTask} />
          ) : isEditingTask ? (
            <EditTask setIsEditingTask={setIsEditingTask} />
          ) : (
            <>
              <div className="flex justify-between mb-10">
                <h4 className="text-sm sm:text-2xl text-white font-semibold w-fit break-all">{data?.data?.title}</h4>
                {/* Three dot option button */}
                <div className="flex items-center gap-2">
                  <Button onClick={() => setIsTaskOptionsOpen(!isTaskOptionsOpen)} type="option" />
                  <Button
                    onClick={() => {
                      stopTimer()
                      setIsTaskDetailsOpen(false)
                    }}
                    type="cross"
                  />
                </div>
                {/* Option menu that contains edit and delete */}
                {isTaskOptionsOpen && <Button setIsEditingTask={setIsEditingTask} setShowDeleteTask={setShowDeleteTask} type="task-option" />}
              </div>
              <label htmlFor="desc" className="text-neutral font-bold mb-2">
                Description
              </label>
              <p className="mb-4 w-full text-white border rounded-md p-4">{data?.data?.description}</p>
              <div className="flex justify-between mb-4 items-center">
                <p className="mb-2 w-fit text-white text-lg font-bold">Subtasks</p>
                <button onClick={() => setIsAddingSubtask(!isAddingSubtask)} title="Add Subtask" className="btn btn-neutral">
                  <FaPlusCircle />
                </button>
              </div>
              {data?.data?.subtasks.map((task) => {
                const { _id: id, status, name } = task ?? {}
                return (
                  <div key={id} className={`flex gap-4 mb-4 p-4 rounded-lg justify-between items-center ${subtaskEditLoading === id ? 'bg-cyan-400' : 'bg-cyan-300'}`}>
                    <div className="flex gap-4">
                      <input
                        onChange={(e) => {
                          changeSubtaskStatus(id, e)
                        }}
                        // if status is done then put a check
                        defaultChecked={status === 'done'}
                        type="checkbox"
                        name="status"
                        value={id}
                        disabled={subtaskEditLoading === id}
                        className="checkbox checkbox-info w-6 cursor-pointer"
                      />

                      <p className={`font-semibold text-black text-lg ${status === 'done' ? 'line-through' : ''}`}>{name}</p>
                    </div>
                    {subtaskEditLoading === id && (
                      <div>
                        <AiOutlineLoading3Quarters className="animate-spin text-black" />
                      </div>
                    )}
                  </div>
                )
              })}
              {isAddingSubtask && (
                <div className="flex my-4 gap-4 items-center">
                  <input onChange={(e) => setSubtaskInput(e.target.value)} autoFocus type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs input-primary" />
                  {subtaskInput && (
                    <button onClick={handleAddSubtask} className="btn btn-neutral">
                      <FaCheckCircle />
                    </button>
                  )}
                </div>
              )}
              <FormRow changeTaskStatus={changeTaskStatus} type="" name="options" inputType="edit-options" />
            </>
          )}

          {data?.data?.deadline && (
            <div className="badge mt-2">
              <label className="label text-white">Deadline: </label>
              {data?.data?.deadline?.split('T')[0]}
            </div>
          )}

          <p className="text-black mt-6 font-semibold">Track Time</p>
          <button
            onClick={() => {
              setShowTimeTracker(!showTimeTracker)
              setTimeout(() => {
                taskContainerRef.current?.scrollTo(0, taskContainerRef.current.scrollHeight)
              }, 0)
            }}
            className="btn btn-sm tooltip tooltip-bottom"
            data-tip="Start Counter"
          >
            <FaClock />
          </button>
          {showTimeTracker && (
            <div className="h-36 flex justify-center items-center text-black rounded-lg mt-4 flex-col gap-2">
              <p className="text-xl">{getFinalTime(timer || 0)}</p>
              <div className="flex gap-2 text-3xl">
                <motion.button {...(timerRunning && { whileTap: { scale: 1.2 } })} disabled={!timerRunning} onClick={stopTimer} className="tooltip tooltip-bottom" data-tip="Pause">
                  <FaPauseCircle />
                </motion.button>
                <motion.button
                  whileTap={{ scale: !timerRunning ? 1.2 : 1 }}
                  disabled={timerRunning}
                  onClick={startTimer}
                  className="tooltip tooltip-bottom"
                  data-tip={!timerRunning ? 'Play' : 'Timer running'}
                >
                  <FaPlayCircle />
                </motion.button>
                <motion.button whileTap={{ scale: 1.2 }} onClick={resetTimer} className="tooltip tooltip-bottom" data-tip="Reset">
                  <BiReset />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      )}
    </Overlay>
  )
}
export default TaskDetails

function strPadLeft(string: number, pad: string, length: number) {
  return (new Array(length + 1).join(pad) + string).slice(-length)
}

export const getFinalTime = (timer: number) => {
  const minutes = Math.floor(timer / 60)
  const seconds = timer - minutes * 60
  const hours = Math.floor(timer / 3600)

  const finalTime = strPadLeft(hours, '0', 2) + ':' + strPadLeft(minutes, '0', 2) + ':' + strPadLeft(seconds, '0', 2)
  return finalTime
}
