import { get, onValue, push, ref, update } from 'firebase/database'
import toast from 'react-hot-toast'
import { User } from '../components/Header'
import fireDB from './firebase'

type UserNotification = {
  type: 'assign' | 'move' | 'status' | 'join' | 'unassign'
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
    switch (payload.type) {
      case 'assign':
        await push(notificationRef, notificationData)
        break
      case 'unassign':
        await push(notificationRef, notificationData)
        break
      default:
        undefined
    }
  } catch (error) {
    toast.error('Error sending notification')
  }
}

export const markAllNotificationAsRead = async (userId: string) => {
  try {
    const db = fireDB
    const notificationRef = ref(db, 'notification/' + userId)
    const data = await get(notificationRef)
    const snapshot: Record<string, Record<string, string | boolean>> = data.val()

    const updatedArrayData = Object.entries(snapshot).map(([key, value]) => {
      const updatedVal = { ...value }
      updatedVal.read = true
      return {
        [key]: updatedVal,
      }
    })
    const updatedSnapshot = updatedArrayData.reduce((acc, curr) => Object.assign(acc, curr), {})

    await update(notificationRef, updatedSnapshot)
  } catch (error) {
    toast.error('Error marking as read')
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
