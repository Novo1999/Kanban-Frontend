import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { BiUserCheck, BiUserPlus } from 'react-icons/bi'
import { FaPhoenixFramework } from 'react-icons/fa'
import { IoIosArrowForward } from 'react-icons/io'
import { useParams } from 'react-router'
import { Tooltip } from 'react-tooltip'
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

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return '?'
    const nameParts = name.split(' ')
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || ''
    const lastInitial = nameParts[1]?.[0]?.toUpperCase() || ''
    return firstInitial + lastInitial
  }

  // Helper function to render avatar group with counter
  const renderAvatarGroup = (users, title, icon, badgeColor) => {
    if (users.length === 0) return null

    const displayUsers = users.slice(0, 2) // Show max 2 avatars in header
    const remainingCount = users.length - 2

    return (
      <div className="flex items-center space-x-2">
        {/* Icon */}
        <div className="flex items-center space-x-1">
          {icon}
          <span className="text-xs font-medium hidden sm:block">{title}</span>
        </div>

        {/* Avatar Group */}
        <div className="avatar-group -space-x-4 rtl:space-x-reverse">
          {displayUsers.map((user) => (
            <div key={user._id}>
              <div className="avatar cursor-pointer" data-tooltip-id={`user-tooltip-${user._id}`} data-tooltip-content={user.name || 'Unknown User'}>
                <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} />
                  ) : (
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-full h-full flex items-center justify-center text-white text-xs font-semibold">{getInitials(user.name)}</div>
                  )}
                </div>
              </div>

              {/* Individual user tooltip */}
              <Tooltip
                id={`user-tooltip-${user._id}`}
                place="bottom"
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  borderRadius: '6px',
                  fontSize: '12px',
                  zIndex: 10000,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                delayShow={300}
                delayHide={100}
                offset={8}
              />
            </div>
          ))}

          {/* Counter for remaining users */}
          {remainingCount > 0 && (
            <div>
              <div className="avatar placeholder cursor-pointer" data-tooltip-id={`remaining-users-${title}`} data-tooltip-content={`${remainingCount} more ${title.toLowerCase()}`}>
                <div className="w-8 rounded-full bg-neutral text-neutral-content ring ring-primary ring-offset-base-100 ring-offset-1">
                  <span className="text-xs">+{remainingCount}</span>
                </div>
              </div>

              {/* Remaining users tooltip */}
              <Tooltip
                id={`remaining-users-${title}`}
                place="bottom"
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  borderRadius: '6px',
                  fontSize: '12px',
                  zIndex: 10000,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                delayShow={300}
                delayHide={100}
                offset={8}
              />
            </div>
          )}
        </div>

        {/* Count badge - only show on larger screens */}
        <div className={`badge badge-xs ${badgeColor} text-white hidden sm:inline-flex`}>{users.length}</div>
      </div>
    )
  }

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
      <header className="absolute bg-primary w-full flex justify-center p-10 shadow-md shrink-0 text-2xl sm:text-4xl transition-all duration-300 text-black font-rammetto m-auto">
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

  const invitedUsers = board?.data?.invitedUsers || []
  const acceptedUsers = board?.data?.acceptedInviteUsers || []

  return (
    <header
      className={`fixed bg-primary w-full p-4 lg:p-10 z-10 ${
        isSidebarOpen && !onMobile ? 'pl-80' : 'pl-4'
      } shadow-xl text-2xl text-black left-0 font-sans top-0 flex flex-col sm:flex-row items-center gap-2 lg:gap-12 sm:gap-4 justify-between`}
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

      {/* Left section - Board name */}
      <div className="flex-1">
        {!isEditingBoard && isLoading ? (
          <Spinner type="header" />
        ) : !isEditingBoard ? (
          <p onClick={() => setIsEditingBoard(true)} className="capitalize font-poppins text-sm sm:text-xl hover:outline px-4 sm:px-12 outline-1">
            {board?.data?.boardName}
          </p>
        ) : (
          <FormRow setIsOptionsOpen={setIsOptionsOpen} isEditingBoard={isEditingBoard} setIsEditingBoard={setIsEditingBoard} type="text" name="board" />
        )}
      </div>

      {/* Center section - Avatar Groups */}
      {id && board?.data && (invitedUsers.length > 0 || acceptedUsers.length > 0) && (
        <div className="flex items-center space-x-4 backdrop-blur-sm rounded-lg p-2">
          {/* Accepted Users */}
          {renderAvatarGroup(acceptedUsers, 'Members', <BiUserCheck className="text-success text-xl" />, 'badge-success')}

          {/* Divider */}
          {acceptedUsers.length > 0 && invitedUsers.length > 0 && <div className="divider divider-horizontal mx-1 w-px"></div>}

          {/* Invited Users */}
          {renderAvatarGroup(invitedUsers, 'Invited', <BiUserPlus className="text-info text-xl" />, 'badge-info')}
        </div>
      )}

      {/* Right section - Action buttons */}
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
