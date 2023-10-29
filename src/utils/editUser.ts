import toast from 'react-hot-toast'
import customFetch from './customFetch.ts'
import axios from 'axios'

export const editUserName = async (editedName: { name?: string }) => {
  try {
    const editedUser = await customFetch.patch(
      '/users/edit-username',
      editedName
    )
    toast.success('Successfully edited name')
    return editedUser
  } catch (error) {
    if (axios.isAxiosError(error)) toast.error(error?.response?.data?.message)
    toast.error('Something went wrong')
  }
}

export const editUserEmail = async (editedEmail: { email?: string }) => {
  try {
    const editedUser = await customFetch.patch(
      '/users/edit-userEmail',
      editedEmail
    )
    toast.success('Successfully edited email')
    return editedUser
  } catch (error) {
    if (axios.isAxiosError(error)) toast.error(error?.response?.data?.message)
    toast.error('Something went wrong')
  }
}
export const editUserPassword = async (editedPassword: {
  password?: string
}) => {
  try {
    const editedUser = await customFetch.patch(
      '/users/edit-userPassword',
      editedPassword
    )
    toast.success('Successfully edited password')
    return editedUser
  } catch (error) {
    if (axios.isAxiosError(error)) toast.error(error?.response?.data?.message)
    toast.error('Something went wrong')
  }
}
