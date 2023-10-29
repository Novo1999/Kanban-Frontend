import { Outlet, useParams } from 'react-router'
import { createContext, useState, useContext, useEffect } from 'react'
import { Header, Sidebar } from '../components'
import useWindowDimensions from '../hooks/useWindowDimension'
import { useQuery } from '@tanstack/react-query'
import customFetch from '../utils/customFetch'

type KanbanContextProp = {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isSidebarOpen: boolean) => void
  showAddNewModal: boolean
  setShowAddNewModal: (showAddNewModal: boolean) => void
  createNewBoard: boolean
  setCreateNewBoard: (createNewBoard: boolean) => void
  selectedBoard: string
  setSelectedBoard: (id: string) => void
  showDeleteBoardModal: boolean
  setShowDeleteBoardModal: (showDeleteBoardModal: boolean) => void
  isTaskDetailsOpen: boolean
  setIsTaskDetailsOpen: (isTaskDetailsOpen: boolean) => void
  selectedTask: string
  setSelectedTask: (id: string) => void
}

const KanbanContext = createContext<KanbanContextProp>({
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
  showAddNewModal: false,
  setShowAddNewModal: () => {},
  createNewBoard: false,
  setCreateNewBoard: () => {},
  selectedBoard: '',
  setSelectedBoard: (id) => {
    id
  },
  showDeleteBoardModal: false,
  setShowDeleteBoardModal: () => {},
  isTaskDetailsOpen: false,
  setIsTaskDetailsOpen: () => {},
  selectedTask: '',
  setSelectedTask: (id) => {
    id
  },
})

export const useKanban = () => useContext(KanbanContext)

function KanbanBoard() {
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
    onMobile ? false : true
  )
  const [showAddNewModal, setShowAddNewModal] = useState<boolean>(false)
  const [showDeleteBoardModal, setShowDeleteBoardModal] =
    useState<boolean>(false)
  const [createNewBoard, setCreateNewBoard] = useState<boolean>(false)
  const [selectedBoard, setSelectedBoard] = useState<string>('')
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState<boolean>(false)
  const [selectedTask, setSelectedTask] = useState<string>('')

  useQuery({
    queryKey: ['current-user'],
    queryFn: async () => await customFetch.get('/users/current-user'),
  })

  useEffect(() => {
    if (onMobile) setIsSidebarOpen(false)
    else setIsSidebarOpen(true)
  }, [onMobile])

  // loading board from the param
  const { id } = useParams()

  useEffect(() => {
    if (id) setSelectedBoard(id)
  }, [id])

  return (
    <KanbanContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        showAddNewModal,
        setShowAddNewModal,
        createNewBoard,
        setCreateNewBoard,
        selectedBoard,
        setSelectedBoard,
        showDeleteBoardModal,
        setShowDeleteBoardModal,
        isTaskDetailsOpen,
        setIsTaskDetailsOpen,
        selectedTask,
        setSelectedTask,
      }}
    >
      <div className='p-10 bg-gradient-to-t from-cyan-900 via-sky-900 to-cyan-900 w-full min-h-screen overflow-hidden'>
        <Header page='home' />
        <Sidebar />
        <Outlet />
      </div>
    </KanbanContext.Provider>
  )
}

export default KanbanBoard
