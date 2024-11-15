import { useQuery } from '@tanstack/react-query'
import customFetch from '../utils/customFetch'

const fetchBoards = async () => await customFetch.get('/kanban/boards')

export const useGetAllBoards = () => {
  const { data: boards } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
  })
  return boards
}
