import { redirect } from 'react-router'
import customFetch from '../utils/customFetch'
import toast from 'react-hot-toast'

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  try {
    await customFetch.post('/auth/register', data)
    toast.success('User registered successfully')
    return redirect('/')
  } catch (error) {
    toast.error('Could not register user.Please try again')
    return error
  }
}
