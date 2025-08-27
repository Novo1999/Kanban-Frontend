import axios from 'axios'
// 'https://kanbann.up.railway.app/api/v1'
export const PROD_URL = import.meta.env.VITE_API_URL

export const DEV_URL = 'http://localhost:6300/api/v1'

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_ENV === 'dev' ? DEV_URL : PROD_URL,
  withCredentials: true,
})

export default customFetch
