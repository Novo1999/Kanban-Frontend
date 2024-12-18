import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CgProfile } from 'react-icons/cg'
import { FaClock, FaPhoenixFramework } from 'react-icons/fa'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { Board, Button, FormRow } from '.'
import { useGetAllBoards } from '../hooks/useGetAllBoards'
import useWindowDimensions from '../hooks/useWindowDimension'
import { useKanban } from '../pages/KanbanBoard'
import { getBoard } from '../utils/getBoard'
import { logOut } from '../utils/logOut'
import Clock from './Clock'

type Board = {
  boardName: string
  createdAt: string
  createdBy: string
  tasks: []
  updatedAt: string
  _id: string
}

const Sidebar = () => {
  const user = useLoaderData() as { name: string; email: string; avatarUrl: string }
  const navigate = useNavigate()
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  const { isSidebarOpen, setIsSidebarOpen, createNewBoard, setCreateNewBoard, selectedBoard, setSelectedBoard } = useKanban()
  const [search, setSearch] = useState('')
  // fetching all boards when sidebar opens
  const boards = useGetAllBoards(search)

  const [isProfileOptionsOpen, setIsProfileOptionsOpen] = useState(false)

  // closing profile option and board input field on click outside
  useEffect(() => {
    const closeOpenfields = (e: MouseEvent) => {
      const target = e.target as Element
      // board input
      if (createNewBoard && !target.closest('.board-input')) setCreateNewBoard(false)
      // profile options
      if (isProfileOptionsOpen && !target.closest('.profile-options')) setIsProfileOptionsOpen(false)
    }
    document.addEventListener('click', closeOpenfields)

    return () => document.removeEventListener('click', closeOpenfields)
  }, [createNewBoard, setCreateNewBoard, isProfileOptionsOpen])

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
      className="w-96 sm:w-72 h-screen shadow-xl top-0 pt-8 z-20 bg-secondary left-0 animate-once animate-ease-in-out fixed flex flex-col"
    >
      {/* Sidebar content split into two flex sections */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="pl-4">
          {/* Logo Section */}
          <div className="flex gap-2 font-rammetto items-center text-3xl text-dark-neutral">
            <FaPhoenixFramework />
            <p className="ml-2">FlowBoard</p>
          </div>

          {/* Clock Section */}
          <div className="flex gap-2 items-center badge-neutral text-white w-fit px-4 rounded-full">
            <FaClock />
            <Clock />
          </div>

          {/* Search */}
          <div className="mt-4">
            <label htmlFor="search" className="text-white">
              Search Board
            </label>
            <input onChange={(e) => setSearch(e.target.value)} type="search" name="search" id="search" value={search} className="input input-primary" />
          </div>

          {/* Boards Count */}
          <p className="text-sm pl-2 pt-6 font-mono font-bold text-dark-neutral">ALL BOARDS ({boards?.data?.length})</p>
        </div>

        {/* Boards List */}
        <motion.div initial="closed" animate="open" variants={sideVariants} className="overflow-y-auto pl-4 text-dark-neutral flex-grow">
          {boards?.data?.map((board: Board) => {
            const { boardName, _id: id } = board
            return (
              <Board
                onClick={() => {
                  getBoard(id)
                  setSelectedBoard(id)
                  onMobile && setIsSidebarOpen(false)
                }}
                key={id}
                boardName={boardName}
                boardId={id}
                selectedBoard={selectedBoard}
              />
            )
          })}
        </motion.div>
      </div>

      {/* Footer Section */}
      <div className="flex-shrink-0 p-4">
        <div className="relative">{createNewBoard ? <FormRow type="text" name="board" /> : <Button onClick={() => setCreateNewBoard(true)} type="createBoard" buttonText="+ Create New Board" />}</div>
        {/* Profile */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col gap-2 items-center profile-options">
            <span className="text-white text-5xl relative cursor-pointer">
              {isProfileOptionsOpen && (
                <div className="animate-fade-up animate-duration-300 animate-once animate-ease-out absolute text-sm bg-neutral rounded-md w-24 h-20 flex flex-col justify-center left-4 bottom-12">
                  <Link to="/settings" className="p-2 hover:bg-secondary bg-opacity-80 hover:text-dark-neutral transition-all duration-300 rounded-sm text-center">
                    Settings
                  </Link>
                  <button
                    onClick={async () => {
                      await logOut()
                      toast.success('Logged out successfully')
                      navigate('/')
                    }}
                    className="p-2 hover:bg-secondary bg-opacity-80 hover:text-dark-neutral transition-all duration-300 rounded-sm"
                  >
                    Log out
                  </button>
                </div>
              )}
              {user.avatarUrl ? (
                <img onClick={() => setIsProfileOptionsOpen(!isProfileOptionsOpen)} className="h-12 rounded-full border p-1 object-contain border-neutral w-12" src={user.avatarUrl} />
              ) : (
                <CgProfile onClick={() => setIsProfileOptionsOpen(!isProfileOptionsOpen)} />
              )}
            </span>
            <p className="capitalize text-white font-semibold text-xs">{user.name.split(' ').at(0)}</p>
          </div>
          <Button onClick={toggleSidebar} type="hide" buttonText="Hide Sidebar" />
        </div>
      </div>
    </motion.aside>
  )
}
export default Sidebar
