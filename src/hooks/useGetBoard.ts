import { useKanban } from '../pages/KanbanBoard'
import { useQuery } from '@tanstack/react-query'
import { getBoard } from '../utils/getBoard'

const useGetBoard = () => {
  const { selectedBoard } = useKanban()

  const { data, isLoading } = useQuery({
    queryKey: ['selected-board', selectedBoard],
    queryFn: ({ queryKey }) => getBoard(queryKey[1]),
  })
  return { data, isLoading }
}
export default useGetBoard
