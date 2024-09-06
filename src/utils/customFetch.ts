import axios from 'axios'
// 'https://kanbann.up.railway.app/api/v1'
const URL = 'https://kanban-backend-novo.vercel.app/api/v1'

const URL2 = 'http://localhost:6300/api/v1'

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_ENV === 'dev' ? URL2 : URL,
  withCredentials: true,
})

export default customFetch
