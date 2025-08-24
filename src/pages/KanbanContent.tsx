import emailjs from '@emailjs/browser'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { BiUserCircle } from 'react-icons/bi'
import { BoardItem, Status, TaskDetails } from '../components/index'
import useGetBoard from '../hooks/useGetBoard'
import useWindowDimensions from '../hooks/useWindowDimension'
import { useKanban } from '../pages/KanbanBoard'
import customFetch from '../utils/customFetch'

const KanbanContent = () => {
  const { showAddNewModal, showDeleteBoardModal, isTaskDetailsOpen, isSidebarOpen } = useKanban()
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  const { data } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => await customFetch.get('/users/current-user'),
  })
  const { data: board } = useGetBoard()
  const boardName = board?.data?.boardName || ''

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviteLoading, setIsInviteLoading] = useState(false)
  const [inviteStatus, setInviteStatus] = useState('')

  // hiding scrollbar when add task modal opens
  useEffect(() => {
    if (!showDeleteBoardModal && !showAddNewModal && !isTaskDetailsOpen && !showInviteModal) document.body.style.overflow = 'visible'
    else document.body.style.overflow = 'hidden'
  }, [showAddNewModal, showDeleteBoardModal, isTaskDetailsOpen, showInviteModal])

  const handleInviteSubmit = async (e) => {
    e.preventDefault()
    setIsInviteLoading(true)
    setInviteStatus('')

    try {
      const userName = data?.data?.name || 'A Flowboard User'
      const inviteLink = 'https://your-app.com/join/board123' // Replace with actual invite link

      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        {
          to_email: inviteEmail,
          subject: `You're invited to join "${boardName}" on Flowboard`,
          message: `${userName} has invited you to join the board "${boardName}" on Flowboard. Click the link below to accept the invitation:\n\n${inviteLink}`,
          from_name: userName,
          board_name: boardName,
          invite_link: inviteLink,
        },
        import.meta.env.VITE_EMAIL_PUBKEY
      )

      setInviteStatus('Invitation sent successfully!')
      setInviteEmail('')

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowInviteModal(false)
        setInviteStatus('')
      }, 2000)
    } catch (error) {
      console.error('Failed to send invitation:', error)
      setInviteStatus('Failed to send invitation. Please try again.')
    } finally {
      setIsInviteLoading(false)
    }
  }

  const openInviteModal = () => {
    setShowInviteModal(true)
    setInviteStatus('')
    setInviteEmail('')
  }

  const closeInviteModal = () => {
    setShowInviteModal(false)
    setInviteStatus('')
    setInviteEmail('')
  }

  return (
    <section className={`m-auto mt-36 ${isSidebarOpen && !onMobile && 'ml-80'}`}>
      {/* Invite User Button */}
      <div className="my-8 max-w-2xl">
        <button onClick={openInviteModal} className="btn btn-primary text-white btn-color">
          <BiUserCircle size={24} />
          Invite User
        </button>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Invite User to "{boardName}"</h3>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  autoFocus
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter user's email address"
                  className="input input-bordered w-full"
                  required
                  disabled={isInviteLoading}
                />
              </div>

              {/* Status Message */}
              {inviteStatus && (
                <div className={`alert ${inviteStatus.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
                  <span>{inviteStatus}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="modal-action">
                <button type="button" onClick={closeInviteModal} className="btn" disabled={isInviteLoading}>
                  Cancel
                </button>
                <button type="submit" className={`btn btn-primary btn-color ${isInviteLoading ? 'loading' : ''}`} disabled={isInviteLoading}>
                  {isInviteLoading ? 'Sending...' : 'Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Status />
      <BoardItem />
      {isTaskDetailsOpen && <TaskDetails />}
    </section>
  )
}

export default KanbanContent
