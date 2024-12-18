import { useQuery } from '@tanstack/react-query'
import customFetch from '../utils/customFetch'

const fetchBoards = async (query: string) => await customFetch.get(`/kanban/boards?query=${query}`)

export const useGetAllBoards = (query: string) => {
  const { data: boards } = useQuery({
    queryKey: ['boards', query],
    queryFn: ({ queryKey }) => fetchBoards(queryKey[1]),
  })
  return boards
}
