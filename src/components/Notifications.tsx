import { useEffect, useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { useLoaderData } from 'react-router'
import { getNotifications } from '../firebase/notifications'
import { User } from './Header'

const Notifications = () => {
  const user = useLoaderData() as User
  const [notifications, setNotifications] = useState({})

  useEffect(() => {
    if (!user?._id) return

    let unsubscribe: (() => void) | undefined

    const setupListener = async () => {
      unsubscribe = await getNotifications(user._id, (data) => {
        setNotifications(data || {})
      })
    }

    setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user?._id])

  // Convert object to array and sort by timestamp
  const notificationArray = Object.entries(notifications)
    .map(([key, notification]) => ({
      ...(notification as any),
      key,
    }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // const getNotificationIcon = (type: string) => {
  //   switch (type) {
  //     case 'assign':
  //       return <FaTasks className="text-blue-500" />
  //     default:
  //       return <FaBell />
  //   }
  // }

  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'assign':
        return `${notification.actionBy.name} assigned you to "${notification.task.name}"`
      default:
        return 'New notification'
    }
  }
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="dropdown-end dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
        <FaBell className="text-xl" />
        {notificationArray.some((n) => !n.read) && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">{notificationArray.filter((n) => !n.read).length}</span>
          </div>
        )}
      </div>

      <div tabIndex={0} className="dropdown-content bg-white rounded-box w-96 shadow-xl border border-gray-200 max-h-80 overflow-hidden">
        {/* Header - fixed */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
        </div>

        {/* Content - scrollable */}
        <div className="overflow-y-auto max-h-64">
          {notificationArray.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications yet</div>
          ) : (
            <>
              {/* Notifications list */}
              <div className="p-2">
                {notificationArray.map((notification) => (
                  <div key={notification.key} className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors mb-2 ${!notification.read ? 'bg-blue-50' : ''}`}>
                    {/* <div className="flex-shrink-0 text-lg">{getNotificationIcon(notification.type)}</div> */}
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img src={notification?.actionBy?.avatarUrl} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{getNotificationMessage(notification)}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(notification.timestamp)}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>}
                  </div>
                ))}
              </div>

              {/* Footer - fixed */}
              <div className="px-4 py-3 border-t border-gray-200 bg-white">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Mark all as read</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
