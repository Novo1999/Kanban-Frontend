import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { BiCheck, BiLoader, BiShield, BiUserCheck, BiX } from 'react-icons/bi'
import { useNavigate, useParams } from 'react-router-dom'
import customFetch from '../utils/customFetch'

const InvitePage = () => {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionStatus, setActionStatus] = useState('')

  // Get current user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => await customFetch.get('/users/current-user'),
  })

  // Get board details
  const {
    data: board,
    isLoading: isLoadingBoard,
    error: boardError,
  } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => await customFetch.get(`/kanban/invite/boards/${boardId}`),
    enabled: !!boardId,
  })

  const boardName = board?.data?.boardName || ''
  const boardCreator = board?.data?.createdBy
  const isLoading = isLoadingUser || isLoadingBoard

  // Check if user is already invited or a member
  const userId = user?.data?._id
  const isInvited = board?.data?.invitedUsers?.map((user) => user?._id)?.includes(userId)
  const isMember = board?.data?.acceptedInviteUsers?.map((user) => user?._id)?.includes(userId)
  const isCreator = boardCreator === userId

  const handleAcceptInvite = async () => {
    if (!userId || !boardId) return

    setIsProcessing(true)
    setActionStatus('')

    try {
      await customFetch.patch(`/kanban/boards/${boardId}/accept-invite`, {
        userId: userId,
      })

      setActionStatus('success')

      // Redirect to board after 2 seconds
      setTimeout(() => {
        navigate(`/kanban/kanban-board/${boardId}`)
      }, 2000)
    } catch (error: any) {
      console.error('Failed to accept invitation:', error)
      const errorMessage = error?.response?.data?.msg || 'Failed to accept invitation'
      setActionStatus(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectInvite = async () => {
    setActionStatus('rejected')

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <BiLoader className="text-4xl text-black animate-spin" />
          <p className="text-black">Loading invitation details...</p>
        </div>
      </div>
    )
  }

  // Board not found
  if (boardError || !board) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="card w-96 bg-white shadow-xl border">
          <div className="card-body text-center">
            <BiX className="text-6xl text-error mx-auto mb-4" />
            <h2 className="card-title justify-center text-error">Board Not Found</h2>
            <p className="text-black">The board you're looking for doesn't exist or has been deleted.</p>
            <div className="card-actions justify-center mt-4">
              <button onClick={() => navigate('/')} className="btn btn-color text-white">
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (actionStatus === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="card w-96 bg-white shadow-xl border">
          <div className="card-body text-center">
            <BiCheck className="text-6xl text-success mx-auto mb-4" />
            <h2 className="card-title justify-center text-success">Invitation Accepted!</h2>
            <p className="text-black">Welcome to "{boardName}"! Redirecting you to the board...</p>
            <div className="flex justify-center mt-4">
              <BiLoader className="text-2xl text-black animate-spin" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Rejected state
  if (actionStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="card w-96 bg-white shadow-xl border">
          <div className="card-body text-center">
            <BiX className="text-6xl text-gray-500 mx-auto mb-4" />
            <h2 className="card-title justify-center text-gray-700">Invitation Declined</h2>
            <p className="text-black">You have declined the invitation to "{boardName}". Redirecting you back...</p>
            <div className="flex justify-center mt-4">
              <BiLoader className="text-2xl text-black animate-spin" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Already a member
  if (isMember) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="card w-96 bg-white shadow-xl border">
          <div className="card-body text-center">
            <BiUserCheck className="text-6xl text-info mx-auto mb-4" />
            <h2 className="card-title justify-center text-info">Already a Member</h2>
            <p className="text-black">You're already a member of "{boardName}"!</p>
            <div className="card-actions justify-center mt-4">
              <button onClick={() => navigate(`/kanban/kanban-board/${boardId}`)} className="btn btn-color text-white">
                Go to Board
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Creator accessing their own board
  if (isCreator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="card w-96 bg-white shadow-xl border">
          <div className="card-body text-center">
            <BiShield className="text-6xl text-purple-600 mx-auto mb-4" />
            <h2 className="card-title justify-center text-purple-700">Your Board</h2>
            <p className="text-black">This is your board "{boardName}". You don't need an invitation!</p>
            <div className="card-actions justify-center mt-4">
              <button onClick={() => navigate(`/kanban/kanban-board/${boardId}`)} className="btn btn-color text-white">
                Go to Board
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Not invited
  if (!isInvited) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="card w-96 bg-white shadow-xl border">
          <div className="card-body text-center">
            <BiX className="text-6xl text-warning mx-auto mb-4" />
            <h2 className="card-title justify-center text-warning">No Invitation Found</h2>
            <p className="text-black">You don't have an invitation to join "{boardName}".</p>
            <div className="card-actions justify-center mt-4">
              <button onClick={() => navigate('/')} className="btn btn-color text-white">
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main invitation page (user has pending invitation)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-white shadow-2xl border">
        <div className="card-body text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <BiUserCheck className="text-6xl mx-auto text-black" />
            <h1 className="text-2xl font-bold text-black">Board Invitation</h1>
          </div>

          {/* Board Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-black">You've been invited to join:</p>
            <h2 className="text-xl font-semibold text-black">"{boardName}"</h2>
          </div>

          {/* Status Message */}
          {actionStatus && !['success', 'rejected'].includes(actionStatus) && (
            <div className="alert alert-error">
              <BiX className="text-lg" />
              <span>{actionStatus}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button onClick={handleRejectInvite} disabled={isProcessing} className="btn btn-outline btn-error flex-1">
              <BiX className="text-lg" />
              Decline
            </button>

            <button onClick={handleAcceptInvite} disabled={isProcessing} className={`btn text-white btn-color flex-1 ${isProcessing ? 'loading' : ''}`}>
              {!isProcessing && <BiCheck className="text-lg" />}
              {isProcessing ? 'Accepting...' : 'Accept Invitation'}
            </button>
          </div>

          {/* Additional Info */}
          <div className="text-center pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-500">By accepting, you'll be able to view and collaborate on this Kanban board.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvitePage
