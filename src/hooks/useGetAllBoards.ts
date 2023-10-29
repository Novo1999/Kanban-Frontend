import customFetch from '../utils/customFetch'
import { useQuery } from '@tanstack/react-query'

const fetchBoards = async () => await customFetch.get('/kanban/boards')

export const useGetAllBoards = () => {
  const { data: boards } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
  })
  return boards
}
