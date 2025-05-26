import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaPhoenixFramework } from 'react-icons/fa'
import { IoIosArrowForward } from 'react-icons/io'
import { useParams } from 'react-router'
import { AddTask, Button, DeleteBoard, FormRow, Spinner } from '.'
import useGetBoard from '../hooks/useGetBoard'
import useWindowDimensions from '../hooks/useWindowDimension'
import { useKanban } from '../pages/KanbanBoard'

type HeaderProp = {
  page: string
}

const Header = ({ page }: HeaderProp) => {
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  const { isSidebarOpen, showAddNewModal, setShowAddNewModal, showDeleteBoardModal, setIsSidebarOpen } = useKanban()
  const { id } = useParams()
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false)
  const [isEditingBoard, setIsEditingBoard] = useState(false)
  const [isSideBarButtonHovered, setIsSideBarButtonHovered] = useState(false)
  const animation = useAnimation()
  const { data: board, isLoading } = useGetBoard()

  useEffect(() => {
    if (isSideBarButtonHovered) {
      animation.start('visible')
    }
    if (!isSideBarButtonHovered) {
      animation.start('hidden')
    }
  }, [animation, isSideBarButtonHovered])

  // clicking outside the options will close it
  useEffect(() => {
    const closeOptions = (e: MouseEvent) => {
      const target = e.target as Element
      if (isOptionsOpen && !target.closest('.option-menu')) {
        setIsOptionsOpen(false)
      }
    }

    document.addEventListener('click', closeOptions)

    return () => document.removeEventListener('click', closeOptions)
  }, [isOptionsOpen])

  // login and register page header
  if (page === 'login' || page === 'register')
    return (
      <header className="absolute bg-primary w-full flex justify-center p-10 shadow-md shrink-0 text-2xl sm:text-4xl transition-all duration-300 text-white font-rammetto m-auto">
        <FaPhoenixFramework />
        <p className="ml-2">FlowBoard</p>
      </header>
    )

  const textAnimation = {
    hidden: {
      opacity: 0,
      y: `0.25em`,
    },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  }

  return (
    <header
      className={`fixed bg-primary w-full p-4 lg:p-10 z-10 ${
        isSidebarOpen && !onMobile ? 'pl-80' : 'pl-4'
      } shadow-xl text-2xl text-white left-0 font-sans top-0 flex flex-col sm:flex-row items-center gap-2 lg:gap-12 sm:gap-0 justify-between`}
    >
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="absolute left-0 top-36 bg-accent rounded-r-full px-1 py-2 flex justify-center transition-all duration-300 gap-2 items-center"
        onMouseEnter={() => setIsSideBarButtonHovered(true)}
        onMouseLeave={() => setIsSideBarButtonHovered(false)}
      >
        <IoIosArrowForward />
        <motion.span initial="hidden" animate={animation} variants={textAnimation} className="text-sm drop-shadow-2xl">
          {isSideBarButtonHovered ? 'Show Sidebar' : ''}
        </motion.span>
      </button>
      {!isEditingBoard && isLoading ? (
        <Spinner type="header" />
      ) : !isEditingBoard ? (
        <p onClick={() => setIsEditingBoard(true)} className="capitalize font-poppins text-sm sm:text-xl hover:outline px-12 outline-1">
          {board?.data?.boardName}
        </p>
      ) : (
        <FormRow setIsOptionsOpen={setIsOptionsOpen} isEditingBoard={isEditingBoard} setIsEditingBoard={setIsEditingBoard} type="text" name="board" />
      )}

      <div className="flex items-center gap-4">
        {id && board?.data?.tasks?.length === 0
          ? ''
          : id && (
              // add new task
              <Button
                onClick={() => {
                  setShowAddNewModal(true)
                }}
                type="add"
                buttonText="+Add New Task"
              />
            )}

        {id && (
          // option button
          <Button
            type="option"
            onClick={() => {
              setIsOptionsOpen(!isOptionsOpen)
            }}
          />
        )}
        {isOptionsOpen && (
          // option-menu
          <Button setIsEditingBoard={setIsEditingBoard} isEditingBoard={isEditingBoard} type="option-menu" />
        )}
      </div>
      {showAddNewModal && createPortal(<AddTask />, document.body)}
      {showDeleteBoardModal && createPortal(<DeleteBoard />, document.body)}
    </header>
  )
}
export default Header
