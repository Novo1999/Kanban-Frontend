import { useQuery } from '@tanstack/react-query'
import { getBoardTask } from '../utils/getBoardTask'
import { useKanban } from '../pages/KanbanBoard'

export const useGetTask = () => {
  const { selectedBoard, selectedTask } = useKanban()

  const { data, isLoading } = useQuery({
    queryKey: ['selected-task', selectedTask],
    queryFn: ({ queryKey }) => getBoardTask(selectedBoard, queryKey[1]),
  })
  return { data, isLoading }
}
