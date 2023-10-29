import { createPortal } from 'react-dom'
import { AddTask, Button, DeleteBoard, FormRow, Spinner } from '.'
import { useKanban } from '../pages/KanbanBoard'
import { useState, useEffect } from 'react'
import useGetBoard from '../hooks/useGetBoard'
import { useParams } from 'react-router'
import useWindowDimensions from '../hooks/useWindowDimension'

type HeaderProp = {
  page: string
}

const Header = ({ page }: HeaderProp) => {
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  const {
    isSidebarOpen,
    showAddNewModal,
    setShowAddNewModal,
    showDeleteBoardModal,
  } = useKanban()
  const { id } = useParams()
  const [isOptionsOpen, setIsOptionsOpen] = useState < boolean > (false)
  const [isEditingBoard, setIsEditingBoard] = useState(false)

  const { data: board, isLoading } = useGetBoard()

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
      <header className='absolute bg-sky-700 w-full flex justify-center p-10 shadow-md shrink-0 text-2xl sm:text-4xl transition-all duration-300 text-white font-rammetto m-auto'>
        Kanban Board
      </header>
    )

  return (
    <header
      className={`fixed bg-sky-700 w-full p-10 z-10 ${isSidebarOpen && !onMobile ? 'pl-80' : 'pl-14'
        } shadow-md text-2xl text-white left-0 font-sans top-0 flex items-center gap-12 sm:gap-0 justify-between`}
    >
      {!isEditingBoard && isLoading ? (
        <Spinner type="header" />
      ) : !isEditingBoard ? (
        <p className='capitalize text-sm sm:text-xl'>{board?.data?.boardName}</p>
      ) : (
        <FormRow
          setIsOptionsOpen={setIsOptionsOpen}
          isEditingBoard={isEditingBoard}
          setIsEditingBoard={setIsEditingBoard}
          type='text'
          name='board'
        />
      )}

      <div className='flex items-center gap-4'>
        {id && board?.data?.tasks?.length === 0
          ? ''
          : id && (
            // add new task
            <Button
              onClick={() => {
                setShowAddNewModal(true)
              }}
              type='add'
              buttonText='+Add New Task'
            />
          )}

        {id && (
          // option button
          <Button
            type='option'
            onClick={() => {
              setIsOptionsOpen(!isOptionsOpen)
            }}
          />
        )}
        {isOptionsOpen && (
          // option-menu
          <Button
            setIsEditingBoard={setIsEditingBoard}
            isEditingBoard={isEditingBoard}
            type='option-menu'
          />
        )}
      </div>
      {showAddNewModal && createPortal(<AddTask />, document.body)}
      {showDeleteBoardModal && createPortal(<DeleteBoard />, document.body)}
    </header>
  )
}
export default Header
