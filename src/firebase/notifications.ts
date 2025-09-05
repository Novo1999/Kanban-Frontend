import { onValue, push, ref } from 'firebase/database'
import toast from 'react-hot-toast'
import { User } from '../components/Header'
import fireDB from './firebase'

type UserNotification = {
  type: 'assign' | 'move' | 'status' | 'join'
  actionBy: User // user id
  board?: {
    id: string
    name: string
  }
  task?: {
    id: string
    name: string
  }
}

export const handleNotification = async (payload: UserNotification, userId: string) => {
  try {
    const db = fireDB
    const notificationRef = ref(db, 'notification/' + userId)

    const {
      actionBy: { email, __v, ...actionByData },
    } = payload ?? {}

    switch (payload.type) {
      case 'assign':
        const notificationData = {
          id: crypto.randomUUID(),
          actionBy: actionByData,
          task: {
            id: payload.task?.id,
            name: payload.task?.name,
          },
          type: payload.type,
          timestamp: new Date().toISOString(),
          read: false,
        }
        await push(notificationRef, notificationData)
        break
      default:
        undefined
    }
  } catch (error) {
    toast.error('Error sending notification')
  }
}

export const getNotifications = async (userId: string, callback: (data: any) => void) => {
  try {
    const db = fireDB
    const notificationRef = ref(db, 'notification/' + userId)

    const unsubscribe = onValue(notificationRef, (snapshot) => {
      const data = snapshot.val()
      callback(data)
    })

    return unsubscribe
  } catch (error) {
    toast.error('Failed to get notifications')
  }
}
