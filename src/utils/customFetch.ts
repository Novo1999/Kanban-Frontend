import axios from 'axios'

const customFetch = axios.create({
  baseURL: 'https://kanbann.up.railway.app/api/v1',
})

export default customFetch
