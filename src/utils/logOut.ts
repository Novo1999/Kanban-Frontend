import toast from 'react-hot-toast'
import customFetch from './customFetch'

export const logOut = async () => {
  try {
    const res = await customFetch.get('/auth/logout')
    return res
  } catch (error) {
    return toast.error('Something went wrong.Please try again')
  }
}
