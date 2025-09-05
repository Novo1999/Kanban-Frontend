import toast from 'react-hot-toast'
import { redirect } from 'react-router'
import customFetch from '../utils/customFetch'

export const action = async ({ request }: { request: Request }) => {
  console.log("🚀 ~ action ~ request:", request)
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  try {
    const response = await customFetch.post('/auth/register', data)
    toast.success('User registered successfully')
    const newUserEmail = response?.data?.newUser?.email
    const password = data.password
    await customFetch.post('/auth/login', { email: newUserEmail, password })
    return redirect('/kanban')
  } catch (error) {
    toast.error('Could not register user.Please try again')
    return error
  }
}
