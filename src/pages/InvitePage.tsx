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
    queryFn: async () => await customFetch.get(`/kanban/boards/${boardId}`),
    enabled: !!boardId,
  })

  const boardName = board?.data?.boardName || ''
  const boardCreator = board?.data?.createdBy
  const isLoading = isLoadingUser || isLoadingBoard

  // Check if user is already invited or a member
  const userId = user?.data?._id
  const isInvited = board?.data?.invitedUsers?.includes(userId)
  const isMember = board?.data?.acceptedInviteUsers?.includes(userId)
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <BiLoader className="text-4xl text-blue-600 animate-spin" />
          <p className="text-white">Loading invitation details...</p>
        </div>
      </div>
    )
  }

  // Board not found
  if (boardError || !board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <BiX className="text-6xl text-error mx-auto mb-4" />
            <h2 className="card-title justify-center text-error">Board Not Found</h2>
            <p className="text-white">The board you're looking for doesn't exist or has been deleted.</p>
            <div className="card-actions justify-center mt-4">
              <button onClick={() => navigate('/')} className="btn btn-primary">
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <BiCheck className="text-6xl text-success mx-auto mb-4" />
            <h2 className="card-title justify-center text-success">Invitation Accepted!</h2>
            <p className="text-white">Welcome to "{boardName}"! Redirecting you to the board...</p>
            <div className="flex justify-center mt-4">
              <BiLoader className="text-2xl text-blue-600 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Rejected state
  if (actionStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white-50 to-slate-100 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <BiX className="text-6xl text-white-500 mx-auto mb-4" />
            <h2 className="card-title justify-center text-white-700">Invitation Declined</h2>
            <p className="text-white">You have declined the invitation to "{boardName}". Redirecting you back...</p>
            <div className="flex justify-center mt-4">
              <BiLoader className="text-2xl text-blue-600 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Already a member
  if (isMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <BiUserCheck className="text-6xl text-info mx-auto mb-4" />
            <h2 className="card-title justify-center text-info">Already a Member</h2>
            <p className="text-white">You're already a member of "{boardName}"!</p>
            <div className="card-actions justify-center mt-4">
              <button onClick={() => navigate(`/kanban/kanban-board/${boardId}`)} className="btn btn-primary">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <BiShield className="text-6xl text-purple-600 mx-auto mb-4" />
            <h2 className="card-title justify-center text-purple-700">Your Board</h2>
            <p className="text-white">This is your board "{boardName}". You don't need an invitation!</p>
            <div className="card-actions justify-center mt-4">
              <button onClick={() => navigate(`/kanban/kanban-board/${boardId}`)} className="btn btn-primary">
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <BiX className="text-6xl text-warning mx-auto mb-4" />
            <h2 className="card-title justify-center text-warning">No Invitation Found</h2>
            <p className="text-white">You don't have an invitation to join "{boardName}".</p>
            <div className="card-actions justify-center mt-4">
              <button onClick={() => navigate('/')} className="btn btn-primary">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <BiUserCheck className="text-6xl text-primary mx-auto" />
            <h1 className="text-2xl font-bold text-white-800">Board Invitation</h1>
          </div>

          {/* Board Info */}
          <div className="bg-base-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-white">You've been invited to join:</p>
            <h2 className="text-xl font-semibold text-primary">"{boardName}"</h2>
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

            <button onClick={handleAcceptInvite} disabled={isProcessing} className={`btn btn-success text-white flex-1 ${isProcessing ? 'loading' : ''}`}>
              {!isProcessing && <BiCheck className="text-lg" />}
              {isProcessing ? 'Accepting...' : 'Accept Invitation'}
            </button>
          </div>

          {/* Additional Info */}
          <div className="text-center pt-4 border-t border-base-300">
            <p className="text-xs text-white-500">By accepting, you'll be able to view and collaborate on this Kanban board.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvitePage
