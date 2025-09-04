import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useLoaderData } from 'react-router'
import { getPriorityConfig } from '../components/CustomDragLayer.jsx'
import { User } from '../components/Header.jsx'
import { addToAssignedMembers, removeFromAssignedMembers } from '../firebase/assigned-members.ts'
import { useKanban } from '../pages/KanbanBoard'
import { editSubtaskStatus } from '../utils/editSubtaskStatus'
import { editTaskStatus } from '../utils/editTaskStatus'
import { useEditTask } from './useEditTask.js'
import useGetBoard from './useGetBoard.js'
import { useGetTask } from './useGetTask.js'

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
      createdBy: string
    }
  }
  isLoading: boolean
}

export const useTaskDetails = () => {
  const { data: taskData, isLoading: isTaskLoading } = useGetTask() as UseGetTask
  const { selectedBoard, selectedTask, setIsTaskDetailsOpen } = useKanban()
  const [isTaskOptionsOpen, setIsTaskOptionsOpen] = useState<boolean>(false)
  const [isEditingTask, setIsEditingTask] = useState<boolean>(false)
  const [isEditingPriority, setIsEditingPriority] = useState<boolean>(false)
  const [isPriorityChanging, setIsPriorityChanging] = useState<boolean>(false)
  const [subtaskEditLoading, setSubtaskEditLoading] = useState('')
  const [showDeleteTask, setShowDeleteTask] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const [timer, setTimer] = useState<number | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showTimeTracker, setShowTimeTracker] = useState(false)
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [subtaskInput, setSubtaskInput] = useState('')
  const intervalId = useRef<NodeJS.Timeout | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [isAssigning, setIsAssigning] = useState<User | null>(null)
  const { onSubmit } = useEditTask()
  const { data: boardData } = useGetBoard()
  const [isUnassigning, setIsUnassigning] = useState('')
  const currentUser = useLoaderData() as User

  // Handle assigning user to task
  const handleAssignUser = async (user: User) => {
    setIsAssigning(user)
    try {
      const currentAssignments = taskData?.data?.assigned || []

      // Check if user is already assigned
      const isAlreadyAssigned = currentAssignments.some((assignment) => assignment.user._id === user._id)
      if (isAlreadyAssigned) {
        alert('User is already assigned to this task')
        setIsAssigning(null)
        return
      }

      await onSubmit({
        ...taskData?.data,
        assigned: [
          ...currentAssignments,
          {
            assignedBy: boardData?.data?.createdBy,
            user,
          },
        ],
      })

      await addToAssignedMembers(boardData?.data?.createdBy, { name: user?.name, userId: user?._id, assignedBy: currentUser?.name })
      queryClient.invalidateQueries({ queryKey: ['selected-task'] })
      queryClient.invalidateQueries({ queryKey: ['selected-board'] })
      setShowAssignModal(false)
    } catch (error) {
      console.error('Error assigning user:', error)
    } finally {
      setIsAssigning(null)
    }
  }

  const handleUnassignUser = async (userId: string, assignmentId: string) => {
    setIsUnassigning(assignmentId)
    try {
      const updatedAssigned = taskData?.data?.assigned?.filter((assignment) => assignment._id !== assignmentId) || []
      await onSubmit({
        ...taskData?.data,
        assigned: updatedAssigned,
      })
      await removeFromAssignedMembers(boardData?.data?.createdBy, userId)
      queryClient.invalidateQueries({ queryKey: ['selected-task', taskData?.data?._id] })
      queryClient.invalidateQueries({ queryKey: ['selected-board'] })
    } catch (error) {
      console.error('Error unassigning user:', error)
    } finally {
      setIsUnassigning('')
    }
  }

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return '?'
    const nameParts = name.split(' ')
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || ''
    const lastInitial = nameParts[1]?.[0]?.toUpperCase() || ''
    return firstInitial + lastInitial
  }

  useEffect(() => {
    if (taskData?.data?._id && timer === null) {
      setTimer(taskData.data.timeTracked || 0)
    }
  }, [taskData, timer])

  // Handle priority change
  const changePriority = async (newPriority: string) => {
    setIsPriorityChanging(true)
    try {
      await onSubmit({ ...taskData?.data, priority: newPriority })
      queryClient.invalidateQueries({ queryKey: ['selected-task', taskData?.data?._id] })
      queryClient.invalidateQueries({ queryKey: ['selected-board'] })
      setIsEditingPriority(false)
    } catch (error) {
      console.error('Error changing priority:', error)
    } finally {
      setIsPriorityChanging(false)
    }
  }

  const startTimer = () => {
    if (intervalId.current) return
    setTimerRunning(true)
    intervalId.current = setInterval(() => {
      setTimer((prev) => (prev || 0) + 1)
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [])

  const stopTimer = () => {
    setTimerRunning(false)
    if (intervalId.current) clearInterval(intervalId.current)
    if (timerRunning) {
      onSubmit({ ...taskData?.data, timeTracked: timer || 0 })
    }
  }

  const resetTimer = async () => {
    setTimerRunning(false)
    if (intervalId.current) clearInterval(intervalId.current)
    setTimer(0)
    await onSubmit({ ...taskData?.data, timeTracked: 0 })
    queryClient.invalidateQueries({ queryKey: ['selected-task'] })
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

  const handleAddSubtask = async () => {
    if (!subtaskInput.trim()) return
    setSubtaskEditLoading('new')
    await onSubmit({
      subtasks: [...taskData.data.subtasks, { name: subtaskInput.trim(), status: 'undone' }],
    })
    queryClient.invalidateQueries({ queryKey: ['selected-task'] })
    setSubtaskInput('')
    setIsAddingSubtask(false)
    setSubtaskEditLoading('')
  }

  const currentPriority = taskData?.data?.priority || 'medium'
  const priorityConfig = getPriorityConfig(currentPriority)

  // Utility functions
  const strPadLeft = (string: number, pad: string, length: number) => {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }

  const getFinalTime = (timer: number) => {
    const minutes = Math.floor(timer / 60)
    const seconds = timer - minutes * 60
    const hours = Math.floor(timer / 3600)

    const finalTime = strPadLeft(hours, '0', 2) + ':' + strPadLeft(minutes, '0', 2) + ':' + strPadLeft(seconds, '0', 2)
    return finalTime
  }

  return {
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
    selectedBoard,
    selectedTask,
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

    // Refs
    intervalId,
  }
}
