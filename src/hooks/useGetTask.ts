import { useQuery } from '@tanstack/react-query'
import { useKanban } from '../pages/KanbanBoard'
import { getBoardTask } from '../utils/getBoardTask'

export const useGetTask = () => {
  const { selectedBoard, selectedTask } = useKanban()

  const { data, isLoading } = useQuery({
    queryKey: ['selected-task', selectedTask],
    queryFn: ({ queryKey }) => getBoardTask(selectedBoard, queryKey[1]),
    enabled(query) {
      return !!query.queryKey[1]
    },
  })
  return { data, isLoading }
}
