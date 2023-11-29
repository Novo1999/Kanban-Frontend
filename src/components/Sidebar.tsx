import { FaGripLinesVertical } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import { useNavigate, useLoaderData } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Board, Button, FormRow } from '.'
import { useKanban } from '../pages/KanbanBoard'

import { getBoard } from '../utils/getBoard'
import { logOut } from '../utils/logOut'
import toast from 'react-hot-toast'
import useWindowDimensions from '../hooks/useWindowDimension'
import { useGetAllBoards } from '../hooks/useGetAllBoards'
import { Link } from 'react-router-dom'

type Board = {
  boardName: string
  createdAt: string
  createdBy: string
  tasks: []
  updatedAt: string
  _id: string
}

const Sidebar = () => {
  const user = useLoaderData() as { name: string; email: string }
  const navigate = useNavigate()
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    createNewBoard,
    setCreateNewBoard,
    selectedBoard,
    setSelectedBoard,
  } = useKanban()

  // fetching all boards when sidebar opens
  const boards = useGetAllBoards()

  const [isProfileOptionsOpen, setIsProfileOptionsOpen] = useState(false)

  // closing profile option and board input field on click outside
  useEffect(() => {
    const closeOpenfields = (e: MouseEvent) => {
      const target = e.target as Element
      // board input
      if (createNewBoard && !target.closest('.board-input'))
        setCreateNewBoard(false)
      // profile options
      if (isProfileOptionsOpen && !target.closest('.profile-options'))
        setIsProfileOptionsOpen(false)
    }
    document.addEventListener('click', closeOpenfields)

    return () => document.removeEventListener('click', closeOpenfields)
  }, [createNewBoard, setCreateNewBoard, isProfileOptionsOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return isSidebarOpen ? (
    <aside className='w-96 sm:w-72 h-screen shadow-xl top-0 pt-8 z-20 bg-cyan-700 left-0 animate-fade-right animate-once animate-ease-in-out fixed'>
      <div className='pl-4'>
        <p className='flex gap-2 font-rammetto items-center text-3xl text-white'>
          <FaGripLinesVertical />
          kanban
        </p>

        <p className='text-sm pl-2 pt-6 font-mono font-bold text-slate-300'>
          ALL BOARDS ({boards?.data?.length})
        </p>
      </div>
      <div className='overflow-y-auto pl-4 h-[70vh]'>
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
      </div>
      <div className='relative bottom-10 sm:bottom-10'>
        {createNewBoard ? (
          <FormRow type='text' name='board' />
        ) : (
          <Button
            onClick={() => setCreateNewBoard(true)}
            type='createBoard'
            buttonText='+ Create New Board'
          />
        )}
      </div>
      {/* profile */}
      <div className='flex gap-14 absolute bottom-9 left-5'>
        <div className='flex flex-col gap-2 items-center profile-options'>
          <span className='text-white text-5xl relative cursor-pointer'>
            {/* profile options when click */}
            {isProfileOptionsOpen && (
              <div className='animate-fade-up animate-duration-300 animate-once animate-ease-out absolute text-sm bg-cyan-800 rounded-md w-24 h-20 flex flex-col justify-center left-4 bottom-12'>
                <Link
                  to='/settings'
                  className='p-2 hover:bg-cyan-600 transition-all duration-300 rounded-sm text-center'
                >
                  Settings
                </Link>
                <button
                  onClick={async () => {
                    await logOut()
                    toast.success('Logged out successfully')
                    navigate('/')
                  }}
                  className='p-2 hover:bg-cyan-600 transition-all duration-300 rounded-sm'
                >
                  Log out
                </button>
              </div>
            )}
            <CgProfile
              onClick={() => setIsProfileOptionsOpen(!isProfileOptionsOpen)}
            />
          </span>
          <p className='capitalize text-white font-semibold text-xs'>
            {user.name.split(' ').at(0)}
          </p>
        </div>
        <Button onClick={toggleSidebar} type='hide' buttonText='Hide Sidebar' />
      </div>
    </aside>
  ) : (
    <Button
      type='show'
      onClick={() => {
        toggleSidebar()
      }}
    />
  )
}
export default Sidebar
