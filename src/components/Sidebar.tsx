import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, Reorder } from 'framer-motion'
import { ChangeEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CgProfile } from 'react-icons/cg'
import { FaClock, FaTrash } from 'react-icons/fa'
import { RxCross1 } from 'react-icons/rx'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { Board, Button, FormRow } from '.'
import useDebounce from '../hooks/useDebounce'
import { useGetAllBoards } from '../hooks/useGetAllBoards'
import useWindowDimensions from '../hooks/useWindowDimension'
import BoardModule from '../Modules/BoardModule'
import { useKanban } from '../pages/KanbanBoard'
import { getBoard } from '../utils/getBoard'
import { logOut } from '../utils/logOut'
import Clock from './Clock'

type Board = {
  boardName: string
  tasks: []
  _id: string
  createdBy: { avatarUrl: string; name: string; _id: string }
  order: number
}

const Sidebar = () => {
  const user = useLoaderData() as { name: string; email: string; avatarUrl: string; _id: string }
  const navigate = useNavigate()
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  const { isSidebarOpen, setIsSidebarOpen, createNewBoard, setCreateNewBoard, selectedBoard, setSelectedBoard, setShowDeleteBoardModal, joinBoard, setJoinBoard } = useKanban()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceSetSearch = useDebounce((val: string) => {
    setDebouncedSearch(val)
  }, 300)
  const [boards, setBoards] = useState<Board[]>([])
  const [tempBoards, setTempBoards] = useState<Board[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debounceSetSearch(value)
  }

  const boardsData = useGetAllBoards(debouncedSearch)
  const sortBoards = (boards: Board[]) => boards.sort((prevBoard, nextBoard) => prevBoard.order - nextBoard.order)

  useEffect(() => {
    if (!boardsData) return
    const sortedBoards = sortBoards(boardsData?.data || [])
    setBoards(sortedBoards)
    setTempBoards(sortedBoards)
  }, [boardsData])

  const handleReorder = (newOrder: Board[]) => {
    setTempBoards(newOrder)
  }

  const reorderBoardMutation = useMutation({
    mutationFn: async (
      changedOrder: {
        boardId: string
        order: number
      }[]
    ) => await BoardModule.reorderBoard(changedOrder),
  })

  const queryClient = useQueryClient()

  const commitReorder = async () => {
    setBoards(tempBoards)
    setIsDragging(false)

    // Create array of objects with boardId and new order
    const reorderPayload = tempBoards.map((board, index) => ({
      boardId: board._id,
      order: index + 1,
    }))

    // Only send boards that actually changed order
    const changedBoards = reorderPayload.filter((item, index) => {
      const originalBoard = boards[index]
      return originalBoard && originalBoard._id !== item.boardId
    })

    // Only make API call if there are actual changes
    if (changedBoards.length > 0) {
      reorderBoardMutation.mutate(reorderPayload, {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['boards'] }),
      })
    }
  }

  const [isProfileOptionsOpen, setIsProfileOptionsOpen] = useState(false)

  useEffect(() => {
    const closeOpenFields = (e: MouseEvent) => {
      const target = e.target as Element
      if (createNewBoard && !target.closest('.board-input')) setCreateNewBoard(false)
      if (isProfileOptionsOpen && !target.closest('.profile-options')) setIsProfileOptionsOpen(false)
    }

    document.addEventListener('click', closeOpenFields)
    return () => document.removeEventListener('click', closeOpenFields)
  }, [createNewBoard, isProfileOptionsOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  const sideVariants = {
    closed: {
      transition: {
        staggerChildren: 0.2,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.2,
        staggerDirection: 1,
      },
    },
  }
  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{
        width: isSidebarOpen ? 300 : 0,
        opacity: isSidebarOpen ? 1 : 0,
      }}
      className="w-96 sm:w-72 h-screen shadow-xl top-0 pt-8 z-20 bg-white left-0 animate-once animate-ease-in-out fixed flex flex-col"
    >
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="pl-4">
          <div className="flex gap-2 font-rammetto items-center text-3xl text-black">
            <motion.div className="flex items-center space-x-2 mb-4" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Flowboard</span>
            </motion.div>
          </div>

          <div className="flex gap-2 items-center bg-gray-100 text-black w-fit px-4 rounded-full">
            <FaClock />
            <Clock />
          </div>

          <div className="mt-4">
            <label htmlFor="search" className="text-black">
              Search Board or Task
            </label>
            <input onChange={handleChange} type="search" name="search" id="search" value={search} className="input input-primary bg-white border border-gray-300 text-black" />
            {search && (
              <button
                onClick={() => {
                  setSearch('')
                  setDebouncedSearch('')
                }}
                className="btn ml-1 btn-sm bg-gray-100 hover:bg-gray-200 text-black border-gray-300"
              >
                <RxCross1 />
              </button>
            )}
          </div>

          <p className="text-sm pl-2 pt-6 font-mono font-bold text-gray-700">ALL BOARDS ({boards?.length})</p>
        </div>

        <motion.div initial="closed" animate="open" variants={sideVariants} className="overflow-y-auto pl-4 text-black flex-grow relative">
          {boards?.length === 0 && <p className="font-bold text-gray-500 left-16 top-60 bottom-2 right-0 absolute">No Board, Create One</p>}
          <Reorder.Group axis="y" values={tempBoards} onReorder={handleReorder}>
            {tempBoards?.map((board) => {
              const { boardName, _id: id, createdBy } = board
              return (
                <Reorder.Item onDragStart={() => setIsDragging(true)} onDragEnd={commitReorder} key={id} value={board} className="relative">
                  <Board
                    createdBy={createdBy}
                    onClick={() => {
                      if (isDragging) return
                      getBoard(id)
                      setSelectedBoard(id)
                      onMobile && setIsSidebarOpen(false)
                      navigate(`/kanban/kanban-board/${id}`)
                    }}
                    boardName={boardName}
                    boardId={id}
                    selectedBoard={selectedBoard}
                  />
                  {/* dont show delete if its someone elses board */}
                  {user?._id === createdBy?._id && (
                    <button
                      onClick={() => {
                        setSelectedBoard(id)
                        setShowDeleteBoardModal(true)
                      }}
                      title="Delete"
                      className="absolute btn right-6 z-50 top-3 bg-transparent border-0 outline-none shadow-none hover:bg-red-100 hover:text-red-600 btn-sm"
                    >
                      <FaTrash className="text-gray-600 hover:text-red-600" />
                    </button>
                  )}
                </Reorder.Item>
              )
            })}
          </Reorder.Group>

          {search && boards?.length === 0 && (
            <p className="text-black">
              No Result for <span className="font-bold">{search}</span>
            </p>
          )}
        </motion.div>
      </div>

      <div className="flex-shrink-0 p-4">
        <div className="flex flex-col gap-2">
          {createNewBoard ? (
            <FormRow type="text" name="board" />
          ) : joinBoard ? (
            <FormRow type="text" name="join-board" placeholder="Invite Link" />
          ) : (
            <>
              <Button onClick={() => setCreateNewBoard(true)} type="createBoard" buttonText=" Create New Board" />
              <Button onClick={() => setJoinBoard(true)} type="joinBoard" buttonText="Join Board" />
            </>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col gap-2 items-center profile-options">
            <span className="text-black text-5xl relative cursor-pointer">
              {isProfileOptionsOpen && (
                <div className="animate-fade-up animate-duration-300 animate-once animate-ease-out absolute text-sm bg-white border border-gray-300 shadow-lg rounded-md w-24 h-20 flex flex-col justify-center left-4 bottom-12">
                  <Link to="/settings" className="p-2 hover:bg-gray-100 text-black transition-all duration-300 rounded-sm text-center">
                    Settings
                  </Link>
                  <button
                    onClick={async () => {
                      await logOut()
                      toast.success('Logged out successfully')
                      navigate('/')
                    }}
                    className="p-2 hover:bg-gray-100 text-black transition-all duration-300 rounded-sm"
                  >
                    Log out
                  </button>
                </div>
              )}
              {user.avatarUrl ? (
                <img onClick={() => setIsProfileOptionsOpen(!isProfileOptionsOpen)} className="h-12 rounded-full border p-1 object-contain border-gray-300 w-12" src={user.avatarUrl} />
              ) : (
                <CgProfile className="text-blue-500" onClick={() => setIsProfileOptionsOpen(!isProfileOptionsOpen)} />
              )}
            </span>
            <p className="capitalize text-blue-500 font-semibold text-xs">{user?.name?.split(' ').at(0)}</p>
          </div>
          <Button onClick={toggleSidebar} type="hide" buttonText="Hide Sidebar" />
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar
