import toast from 'react-hot-toast'
import customFetch from '../utils/customFetch'
import { redirect } from 'react-router'

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  if (!data) return
  if (data)
    try {
      await customFetch.post('/auth/login', data)
      toast.success('Login successful')
      return redirect('/kanban')
    } catch (error) {
      toast.error('Could not log in')
      return error
    }
}
