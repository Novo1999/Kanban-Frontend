import axios from 'axios'
// 'https://kanbann.up.railway.app/api/v1'
const customFetch = axios.create({
  baseURL: 'https://kanban-backend-novo.vercel.app/api/v1',
  withCredentials: true,
})

export default customFetch
