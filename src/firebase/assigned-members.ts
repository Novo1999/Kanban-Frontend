import { get, ref, update } from 'firebase/database';
import toast from 'react-hot-toast';
import fireDB from './firebase';

export const addToAssignedMembers = async (boardOwnerId: string, newMember: { userId: string; name: string, assignedBy: string }) => {
  const db = fireDB
  const taskRef = ref(db, 'task/' + boardOwnerId)

  // Get current assigned array
  const snapshot = await get(taskRef)
  console.log('🚀 ~ addToAssignedMembers ~ snapshot:', snapshot)
  const currentData = snapshot.val() || {}
  console.log('🚀 ~ addToAssignedMembers ~ currentData:', currentData)
  const currentAssigned = currentData.assigned || []

  // Add the new member to the array
  if (currentAssigned.some((member) => member.userId === newMember.userId)) {
    toast.error('Failed adding to assigned')
    return
  }
  const updatedAssigned = [...currentAssigned, newMember]

  // Update just the assigned field
  await update(taskRef, {
    assigned: updatedAssigned,
  })
}

export const removeFromAssignedMembers = async (boardOwnerId: string, userIdToRemove: string) => {
  const db = fireDB
  const taskRef = ref(db, 'task/' + boardOwnerId)

  // Get current assigned array
  const snapshot = await get(taskRef)
  console.log('🚀 ~ removeFromAssignedMembers ~ snapshot:', snapshot)
  const currentData = snapshot.val() || {}
  console.log('🚀 ~ removeFromAssignedMembers ~ currentData:', currentData)
  const currentAssigned = currentData.assigned || []

  const updatedAssigned = currentAssigned.filter((member) => member.userId !== userIdToRemove)

  // Update just the assigned field
  await update(taskRef, {
    assigned: updatedAssigned,
  })
}
export const getAssignedMembers = async (boardOwnerId: string) => {
  const db = fireDB
  const taskRef = ref(db, 'task/' + boardOwnerId)

  // Get current assigned array
  const snapshot = await get(taskRef)
  const currentData = snapshot.val() || {}
  const currentAssigned = currentData.assigned || []

  return currentAssigned
}
