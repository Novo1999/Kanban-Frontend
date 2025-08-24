import emailjs from '@emailjs/browser'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { BiUserCircle } from 'react-icons/bi'
import useGetBoard from '../hooks/useGetBoard'
import customFetch from '../utils/customFetch'

const InviteUser = () => {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => await customFetch.get('/users/current-user'),
  })

  const { data: board, isLoading: isLoadingBoard } = useGetBoard()
  const boardName = board?.data?.boardName || ''
  const isUsersBoard = board?.data?.createdBy === user?.data?._id

  const isLoading = isLoadingBoard && isLoadingUser

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviteLoading, setIsInviteLoading] = useState(false)
  const [inviteStatus, setInviteStatus] = useState('')

  const handleInviteSubmit = async (e) => {
    e.preventDefault()
    setIsInviteLoading(true)
    setInviteStatus('')

    try {
      // First check if user exists
      const userByEmail = await customFetch.get(`/users/${inviteEmail}`)
      const userExists = userByEmail?.data?.length > 0

      if (!userExists) {
        setInviteStatus('User does not exist')
        setIsInviteLoading(false)
        return
      }

      const userToInvite = userByEmail.data[0]
      const userIdToInvite = userToInvite._id

      // Try to invite the user to the board
      try {
        await customFetch.post(`/kanban/boards/${board?.data?._id}/invite-user`, {
          userId: userIdToInvite,
        })

        // If invitation is successful, send email
        const userName = user?.data?.name || 'A Flowboard User'
        const inviteLink = `${window.location.origin}/invite/${board?.data?._id}` // Dynamic invite link

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
      } catch (inviteError: any) {
        // Handle specific invitation errors from backend
        const errorMessage = inviteError?.response?.data?.msg || 'Failed to send invitation'

        if (errorMessage.includes('already invited')) {
          setInviteStatus('This user has already been invited to this board')
        } else if (errorMessage.includes('already a member')) {
          setInviteStatus('This user is already a member of this board')
        } else {
          setInviteStatus(errorMessage)
        }
      }
    } catch (error) {
      console.error('Failed to process invitation:', error)
      setInviteStatus('Failed to process invitation. Please try again.')
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
    <>
      {/* Invite User Button */}
      <div className="my-8 max-w-2xl overflow-hidden">
        {!isLoading && isUsersBoard && (
          <button disabled={!isUsersBoard} onClick={openInviteModal} className="btn btn-primary text-white btn-color">
            <BiUserCircle size={24} />
            Invite User
          </button>
        )}
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="modal modal-open">
          <div className="modal-box overflow-hidden">
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
                <div
                  className={`alert ${
                    inviteStatus.includes('successfully')
                      ? 'alert-success'
                      : inviteStatus.includes('does not exist') || inviteStatus.includes('already invited') || inviteStatus.includes('already a member')
                      ? 'alert-warning'
                      : 'alert-error'
                  }`}
                >
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
    </>
  )
}

export default InviteUser
