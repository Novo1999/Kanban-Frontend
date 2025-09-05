import { useQueryClient } from '@tanstack/react-query'
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import { BiUserCheck, BiUserPlus } from 'react-icons/bi'
import { FaTrash } from 'react-icons/fa'
import { IoIosArrowForward } from 'react-icons/io'
import { useLoaderData, useParams } from 'react-router'
import { Tooltip } from 'react-tooltip'
import { AddTask, Button, DeleteBoard, Spinner } from '.'
import useGetBoard from '../hooks/useGetBoard'
import useWindowDimensions from '../hooks/useWindowDimension'
import { useKanban } from '../pages/KanbanBoard'
import customFetch from '../utils/customFetch'

type HeaderProp = {
  page: string
}

export type User = { name: string; email: string; avatarUrl: string; _id: string }

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
  const user = useLoaderData() as User
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [isDeletingMember, setIsDeletingMember] = useState('')
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [boardName, setBoardName] = useState('')
  const [isUpdatingBoard, setIsUpdatingBoard] = useState(false)
  const queryClient = useQueryClient()

  // Initialize board name when board data loads
  useEffect(() => {
    if (board?.data?.boardName) {
      setBoardName(board.data.boardName)
    }
  }, [board?.data?.boardName])

  // Handle board name update
  const handleUpdateBoardName = async () => {
    if (!boardName.trim() || boardName === board?.data?.boardName) {
      setIsEditingBoard(false)
      return
    }

    setIsUpdatingBoard(true)
    try {
      await customFetch.patch(`/kanban/boards/${id}`, {
        boardName: boardName.trim(),
      })
      toast.success('Board name updated successfully')
      queryClient.invalidateQueries({ queryKey: ['selected-board', id] })
      setIsEditingBoard(false)
    } catch (error) {
      console.error('Failed to update board name:', error)
      toast.error('Failed to update board name')
    } finally {
      setIsUpdatingBoard(false)
    }
  }

  // Update the delete function to only handle members
  const handleRemoveMember = async (userId: string) => {
    setIsDeletingMember(userId)
    try {
      await customFetch.patch(`/kanban/boards/${id}/remove-member`, {
        userId,
      })
      toast.success('Member removed successfully')
      queryClient.invalidateQueries({ queryKey: ['selected-board', id] })
    } catch (error) {
      console.error('Failed to remove member:', error)
      toast.error('Failed to remove member')
    } finally {
      setIsDeletingMember('')
      setShowConfirmDelete(false)
      setShowMembersModal(false)
    }
  }
  // Add function to initiate delete
  const initiateDelete = (user: User) => {
    setUserToDelete(user)
    setShowConfirmDelete(true)
  }
  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return '?'
    const nameParts = name.split(' ')
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || ''
    const lastInitial = nameParts[1]?.[0]?.toUpperCase() || ''
    return firstInitial + lastInitial
  }

  const renderAvatarGroup = (users, title, icon, badgeColor) => {
    if (users.length === 0) return null

    const displayUsers = users.slice(0, 2)
    const remainingCount = users.length - 2
    const isMembers = title === 'Members'
    const isOwner = user?._id === board?.data?.createdBy

    return (
      <div
        className={`flex items-center space-x-2 ${isMembers && isOwner ? 'cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-all duration-200' : ''}`}
        onClick={isMembers && isOwner ? () => setShowMembersModal(true) : undefined}
      >
        <div className="flex items-center space-x-1">
          {icon}
          <span className="text-xs font-medium hidden sm:block">{title}</span>
        </div>

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

          {remainingCount > 0 && (
            <div>
              <div className="avatar placeholder cursor-pointer" data-tooltip-id={`remaining-users-${title}`} data-tooltip-content={`${remainingCount} more ${title.toLowerCase()}`}>
                <div className="w-8 rounded-full bg-neutral text-neutral-content ring ring-primary ring-offset-base-100 ring-offset-1">
                  <span className="text-xs">+{remainingCount}</span>
                </div>
              </div>

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
        <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
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

      {/* Left section - Board name (no longer editable inline) */}
      <div className="flex-1">
        {isLoading ? (
          <Spinner type="header" />
        ) : (
          <p onClick={() => setIsEditingBoard(true)} className="capitalize font-poppins text-sm sm:text-xl hover:outline px-4 sm:px-12 outline-1 cursor-pointer">
            {board?.data?.boardName}
          </p>
        )}
      </div>
      {/* <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
          <FaBell className="text-xl" />
          {notifications.some((n) => !n.read) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{notifications.filter((n) => !n.read).length}</span>
            </div>
          )}
        </div>
        <div tabIndex={0} className="dropdown-content menu bg-white rounded-box w-80 p-2 shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>

            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications yet</div>
            ) : (
              <div className="py-2">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-color`}>
                    <div className="flex-shrink-0 text-lg">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>}
                  </div>
                ))}

                <div className="px-4 py-2 border-t border-gray-200 mt-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Mark all as read</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div> */}
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

      {/* Members Modal */}
      {showMembersModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-white">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Board Members</h3>

            {acceptedUsers.length === 0 ? (
              <p className="text-gray-500">No members yet</p>
            ) : (
              <div className="space-y-3">
                {acceptedUsers.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} />
                          ) : (
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-full h-full flex items-center justify-center text-white text-sm font-semibold">
                              {getInitials(member.name)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => initiateDelete(member)}
                      disabled={isDeletingMember === member._id}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-gray-500 flex items-center justify-center transition-colors"
                    >
                      {isDeletingMember === member._id ? <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div> : <FaTrash className="w-3 h-3" />}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-action">
              <button className="btn bg-blue-600 text-white border-0 hover:bg-blue-700" onClick={() => setShowMembersModal(false)}>
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowMembersModal(false)}>close</button>
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal modal-open">
          <div className="modal-box bg-white">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Confirm Removal</h3>
            <p className="py-4 text-gray-700">
              Are you sure you want to remove <strong>{userToDelete?.name}</strong> from this board? This action cannot be undone.
            </p>

            <div className="modal-action">
              <button
                className="btn bg-gray-100 text-gray-700 border-0 hover:bg-gray-200"
                onClick={() => {
                  setShowConfirmDelete(false)
                  setUserToDelete(null)
                }}
                disabled={!!isDeletingMember}
              >
                Cancel
              </button>
              <button className="btn bg-red-600 text-white border-0 hover:bg-red-700" onClick={() => handleRemoveMember(userToDelete?._id || '')} disabled={!!isDeletingMember}>
                {isDeletingMember ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Removing...
                  </div>
                ) : (
                  'Remove Member'
                )}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                setShowConfirmDelete(false)
                setUserToDelete(null)
              }}
            >
              close
            </button>
          </form>
        </div>
      )}

      {/* Edit Board Modal */}
      {isEditingBoard && (
        <div className="modal modal-open">
          <div className="modal-box bg-white max-w-md">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Edit Board Name</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="boardName" className="block text-sm font-semibold text-gray-900 mb-2">
                  Board Name
                </label>
                <input
                  type="text"
                  id="boardName"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="Enter board name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn bg-gray-100 text-gray-700 border-0 hover:bg-gray-200"
                onClick={() => {
                  setIsEditingBoard(false)
                  setBoardName(board?.data?.boardName || '')
                }}
                disabled={isUpdatingBoard}
              >
                Cancel
              </button>
              <button className="btn bg-blue-600 text-white border-0 hover:bg-blue-700" onClick={handleUpdateBoardName} disabled={isUpdatingBoard || !boardName.trim()}>
                {isUpdatingBoard ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Board'
                )}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                setIsEditingBoard(false)
                setBoardName(board?.data?.boardName || '')
              }}
            >
              close
            </button>
          </form>
        </div>
      )}
    </header>
  )
}

export default Header
