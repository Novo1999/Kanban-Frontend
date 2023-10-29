import { redirect } from 'react-router'
import customFetch from '../utils/customFetch'
import { AxiosResponse } from 'axios'

export interface Data {
  data?: Promise<
    AxiosResponse<{
      _id: string
      name: string
      email: string
    }>
  >
}

export const loader = async () => {
  try {
    const { data } = (await customFetch.get('/users/current-user')) as Data
    return data
  } catch (error) {
    return redirect('/')
  }
}
