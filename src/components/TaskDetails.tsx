import { motion } from 'framer-motion'
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { BiReset, BiUserPlus } from 'react-icons/bi'
import { FaCheckCircle, FaClock, FaEdit, FaPauseCircle, FaPlayCircle, FaPlusCircle } from 'react-icons/fa'
import { HiDotsVertical, HiX } from 'react-icons/hi'
import { useLoaderData } from 'react-router'
import { DeleteTask, EditTask, FormRow, Overlay, Spinner } from '.'
import { useTaskDetails } from '../hooks/useTaskDetails.js'
import { getPriorityConfig } from './CustomDragLayer.jsx'
import { User } from './Header.jsx'

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
      priority?: string
      timeTracked: number
      deadline: string | null
      assigned?: { user: User; assignedBy: User; assignedAt: string; _id: string }[]
    }
  }
  isLoading: boolean
}

const TaskDetails = () => {
  const {
    // Data
    taskData,
    isTaskLoading,
    boardData,
    currentPriority,
    priorityConfig,

    // State
    isTaskOptionsOpen,
    setIsTaskOptionsOpen,
    isEditingTask,
    setIsEditingTask,
    isEditingPriority,
    setIsEditingPriority,
    isPriorityChanging,
    subtaskEditLoading,
    showDeleteTask,
    setShowDeleteTask,
    timer,
    timerRunning,
    showTimeTracker,
    setShowTimeTracker,
    isAddingSubtask,
    setIsAddingSubtask,
    subtaskInput,
    setSubtaskInput,
    showAssignModal,
    setShowAssignModal,
    isAssigning,
    isUnassigning,

    // Kanban context
    setIsTaskDetailsOpen,

    // Handlers
    handleAssignUser,
    handleUnassignUser,
    getInitials,
    changePriority,
    startTimer,
    stopTimer,
    resetTimer,
    changeSubtaskStatus,
    changeTaskStatus,
    handleAddSubtask,
    getFinalTime,
  } = useTaskDetails()
  const taskContainerRef = useRef<HTMLDivElement | null>(null)

  // clicking on taskContainerRef will disable the option menu
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === taskContainerRef.current) {
      setIsTaskOptionsOpen(false)
      setIsEditingTask(false)
      setIsEditingPriority(false)
    }
  }

  const user = useLoaderData() as User
  const isOwner = taskData?.data?.createdBy === user?._id

  return (
    <Overlay operationsWhenOverlayClicked={[stopTimer]}>
      {isTaskLoading ? (
        <Spinner />
      ) : (
        <div
          ref={taskContainerRef}
          onClick={handleContainerClick}
          className={`bg-white w-[35rem] max-h-[70vh]
          } mx-6 sm:mx-0 h-[50rem] animate-fade-down animate-once animate-duration-[400ms] animate-normal rounded-xl p-8 overflow-y-scroll my-10 shadow-xl border border-gray-100`}
        >
          {/* Shows the delete modal inside the task details */}
          {showDeleteTask ? (
            <DeleteTask setShowDeleteTask={setShowDeleteTask} />
          ) : isEditingTask ? (
            createPortal(<EditTask setIsEditingTask={setIsEditingTask} />, document.body)
          ) : (
            <>
              {/* Header Section */}
              <div className="flex justify-between items-start mb-8">
                <h4 className="text-xl font-semibold text-gray-900 leading-tight flex-1 pr-4">{taskData?.data?.title}</h4>

                {/* Action buttons with consistent styling */}
                <div className="flex items-center gap-3 relative">
                  <button onClick={() => setIsTaskOptionsOpen(!isTaskOptionsOpen)} className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <HiDotsVertical className="w-4 h-4 text-gray-600" />
                  </button>

                  <button
                    onClick={() => {
                      stopTimer()
                      setIsTaskDetailsOpen(false)
                    }}
                    className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <HiX className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Option menu with consistent styling */}
                  {isTaskOptionsOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[140px] z-10">
                      <button
                        onClick={() => {
                          setIsEditingTask(true)
                          setIsTaskOptionsOpen(false)
                        }}
                        className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2 text-sm"
                      >
                        <FaEdit className="w-3 h-3" />
                        Edit Task
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteTask(true)
                          setIsTaskOptionsOpen(false)
                        }}
                        className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 text-sm"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete Task
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Priority Section with professional card styling */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Priority</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {isEditingPriority ? (
                    <div className="flex gap-2 flex-wrap items-center">
                      {isPriorityChanging ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-600 text-sm">Updating priority...</span>
                        </div>
                      ) : (
                        ['high', 'medium', 'low'].map((priority) => {
                          const config = getPriorityConfig(priority)
                          return (
                            <button
                              key={priority}
                              onClick={() => changePriority(priority)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPriority === priority ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                              disabled={isPriorityChanging}
                            >
                              {config.emoji} {config.label}
                            </button>
                          )
                        })
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingPriority(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-900 hover:bg-white hover:shadow-sm transition-all cursor-pointer border border-transparent hover:border-gray-300"
                      title="Click to change priority"
                      disabled={isPriorityChanging}
                    >
                      {isPriorityChanging ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          {priorityConfig.emoji} {priorityConfig.label}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Assign User Section with consistent button styling */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Assigned Users</label>
                {isOwner && (
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <BiUserPlus className="w-4 h-4" />
                    Assign User
                  </button>
                )}
              </div>

              {/* Assigned Users Display - keeping the existing professional styling */}
              {taskData?.data?.assigned && taskData.data.assigned.length > 0 && (
                <div className="mb-6">
                  <div className="space-y-2">
                    {taskData.data.assigned.map((assignment) => (
                      <div key={assignment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              {assignment.user.avatarUrl ? (
                                <img src={assignment.user.avatarUrl} alt={assignment.user.name} />
                              ) : (
                                <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                                  {getInitials(assignment.user.name)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{assignment.user.name}</p>
                            <p className="text-xs text-gray-500">
                              Assigned by {assignment.assignedBy.name} • {new Date(assignment.assignedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {isOwner && (
                          <button
                            onClick={() => handleUnassignUser(assignment.user._id, assignment._id)}
                            disabled={isUnassigning === assignment._id}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-gray-500 flex items-center justify-center transition-colors"
                            title="Remove assignment"
                          >
                            {isUnassigning === assignment._id ? <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div> : <HiX className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description Section with professional styling */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Description</label>
                {taskData?.data?.description ? (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <p className="text-gray-700 leading-relaxed">{taskData.data.description}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <p className="text-gray-500 italic">No description provided</p>
                  </div>
                )}
              </div>

              {/* Subtasks Section with professional styling */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-900">Subtasks</label>
                  <button
                    onClick={() => setIsAddingSubtask(!isAddingSubtask)}
                    className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm"
                    title="Add Subtask"
                  >
                    <FaPlusCircle className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {taskData?.data?.subtasks.map((task) => {
                    const { _id: id, status, name } = task ?? {}
                    return (
                      <div
                        key={id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          subtaskEditLoading === id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          onChange={(e) => changeSubtaskStatus(id, e)}
                          defaultChecked={status === 'done'}
                          type="checkbox"
                          name="status"
                          value={id}
                          disabled={subtaskEditLoading === id}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <p className={`flex-1 text-gray-900 ${status === 'done' ? 'line-through text-gray-500' : ''}`}>{name}</p>
                        {subtaskEditLoading === id && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                      </div>
                    )
                  })}

                  {isAddingSubtask && (
                    <div className="flex gap-2 items-center p-3 bg-white rounded-lg border border-gray-300">
                      <input
                        onChange={(e) => setSubtaskInput(e.target.value)}
                        autoFocus
                        type="text"
                        placeholder="Enter subtask name"
                        className="flex-1 px-3 py-2 bg-primary border border-gray-300  text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      {subtaskInput && (
                        <button
                          onClick={handleAddSubtask}
                          className="w-8 h-8 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                          disabled={subtaskEditLoading === 'new'}
                        >
                          {subtaskEditLoading === 'new' ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div> : <FaCheckCircle className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Section */}
              <div className="mb-6">
                <FormRow changeTaskStatus={changeTaskStatus} type="" name="options" inputType="edit-options" />
              </div>

              {/* Deadline Section with professional badge */}
              {taskData?.data?.deadline && (
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <FaClock className="w-3 h-3 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Deadline: {new Date(taskData.data.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {/* Time Tracker Section with professional styling */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Time Tracking</label>
                <button
                  onClick={() => {
                    setShowTimeTracker(!showTimeTracker)
                    setTimeout(() => {
                      taskContainerRef.current?.scrollTo(0, taskContainerRef.current.scrollHeight)
                    }, 0)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <FaClock className="w-4 h-4" />
                  {showTimeTracker ? 'Hide Timer' : 'Show Timer'}
                </button>

                {showTimeTracker && (
                  <div className="mt-4 bg-gray-50 rounded-lg border border-gray-200 p-6">
                    <div className="text-center">
                      <div className="text-3xl font-mono font-semibold text-gray-900 mb-4">{getFinalTime(timer || 0)}</div>
                      <div className="flex justify-center gap-3">
                        <motion.button
                          {...(timerRunning && { whileTap: { scale: 1.05 } })}
                          disabled={!timerRunning}
                          onClick={stopTimer}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            timerRunning ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          title="Pause"
                        >
                          <FaPauseCircle className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: !timerRunning ? 1.05 : 1 }}
                          disabled={timerRunning}
                          onClick={startTimer}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            !timerRunning ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          title={!timerRunning ? 'Start' : 'Timer running'}
                        >
                          <FaPlayCircle className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 1.05 }}
                          onClick={resetTimer}
                          className="w-10 h-10 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center transition-colors"
                          title="Reset"
                        >
                          <BiReset className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Assign User Modal with consistent styling */}
      {showAssignModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-white max-w-md">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Assign User to Task</h3>

            {boardData?.data?.acceptedInviteUsers?.filter((user) => !taskData?.data?.assigned?.some((assignment) => assignment?.user?._id === user._id))?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No unassigned members available</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {boardData?.data?.acceptedInviteUsers
                  ?.filter((user) => !taskData?.data?.assigned?.some((assignment) => assignment?.user?._id === user._id))
                  ?.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} />
                            ) : (
                              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-full h-full flex items-center justify-center text-white text-sm font-semibold">
                                {getInitials(user.name)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAssignUser(user)}
                        disabled={isAssigning?._id === user._id}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 min-w-[60px]"
                      >
                        {isAssigning?._id === user._id ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : 'Assign'}
                      </button>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors" onClick={() => setShowAssignModal(false)}>
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowAssignModal(false)}>close</button>
          </form>
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
