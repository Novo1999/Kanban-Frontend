import { motion } from 'framer-motion'
import { ChangeEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CgProfile } from 'react-icons/cg'
import { FaClock, FaPhoenixFramework, FaTrash } from 'react-icons/fa'
import { RxCross1 } from 'react-icons/rx'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { Board, Button, FormRow } from '.'
import useDebounce from '../hooks/useDebounce'
import { useGetAllBoards } from '../hooks/useGetAllBoards'
import useWindowDimensions from '../hooks/useWindowDimension'
import { useKanban } from '../pages/KanbanBoard'
import { getBoard } from '../utils/getBoard'
import { logOut } from '../utils/logOut'
import Clock from './Clock'

type Board = {
  boardName: string
  tasks: []
  _id: string
}

const Sidebar = () => {
  const user = useLoaderData() as { name: string; email: string; avatarUrl: string }
  const navigate = useNavigate()
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  const { isSidebarOpen, setIsSidebarOpen, createNewBoard, setCreateNewBoard, selectedBoard, setSelectedBoard, setShowDeleteBoardModal } = useKanban()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  
  const debounceSetSearch = useDebounce((val: string) => {
    setDebouncedSearch(val)
  }, 300)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debounceSetSearch(value)
  }

  const boards = useGetAllBoards(debouncedSearch)

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
      className="w-96 sm:w-72 h-screen shadow-xl top-0 pt-8 z-20 bg-secondary left-0 animate-once animate-ease-in-out fixed flex flex-col"
    >
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="pl-4">
          <div className="flex gap-2 font-rammetto items-center text-3xl text-dark-neutral">
            <FaPhoenixFramework />
            <p className="ml-2">FlowBoard</p>
          </div>

          <div className="flex gap-2 items-center badge-neutral text-white w-fit px-4 rounded-full">
            <FaClock />
            <Clock />
          </div>

          <div className="mt-4">
            <label htmlFor="search" className="text-white">
              Search Board or Task
            </label>
            <input onChange={handleChange} type="search" name="search" id="search" value={search} className="input input-primary bg-white text-black" />
            {search && (
              <button
                onClick={() => {
                  setSearch('')
                  setDebouncedSearch('')
                }}
                className="btn ml-1 btn-sm"
              >
                <RxCross1 />
              </button>
            )}
          </div>

          <p className="text-sm pl-2 pt-6 font-mono font-bold text-dark-neutral">ALL BOARDS ({boards?.data?.length})</p>
        </div>

        <motion.div initial="closed" animate="open" variants={sideVariants} className="overflow-y-auto pl-4 text-dark-neutral flex-grow">
          {boards?.data?.map((board: Board) => {
            const { boardName, _id: id } = board
            return (
              <div key={id} className="relative">
                <Board
                  onClick={() => {
                    getBoard(id)
                    setSelectedBoard(id)
                    onMobile && setIsSidebarOpen(false)
                  }}
                  boardName={boardName}
                  boardId={id}
                  selectedBoard={selectedBoard}
                />
                <button
                  onClick={() => {
                    setSelectedBoard(id)
                    setShowDeleteBoardModal(true)
                  }}
                  title="Delete"
                  className="absolute btn right-6 z-50 top-3 bg-transparent border-0 outline-none shadow-none hover:bg-red-600 btn-sm"
                >
                  <FaTrash className="text-white" />
                </button>
              </div>
            )
          })}

          {boards?.data?.length === 0 && (
            <p className="text-white">
              No Result for <span className="font-bold">{search}</span>
            </p>
          )}
        </motion.div>
      </div>

      <div className="flex-shrink-0 p-4">
        <div className="relative">{createNewBoard ? <FormRow type="text" name="board" /> : <Button onClick={() => setCreateNewBoard(true)} type="createBoard" buttonText="+ Create New Board" />}</div>
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
