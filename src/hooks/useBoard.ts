import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import BoardModule from "../Modules/BoardModule"
import { useKanban } from "../pages/KanbanBoard"

const useBoard = () => {
    const { selectedBoard, setCreateNewBoard } = useKanban()
    const queryClient = useQueryClient()
    const {
        handleSubmit,
        register,
        reset,
        watch,
        formState: { errors },
    } = useForm<{ boardName: string }>()

    // queries
    const boardData = useQuery({
        queryKey: ['selected-board', selectedBoard],
        queryFn: ({ queryKey }) => BoardModule.getBoard(queryKey[1]),
    })

    const allBoardData = useQuery({
        queryKey: ['boards'],
        queryFn: () => BoardModule.getAllBoards(),
    })

    // mutations
    const onBoardCreate = async (data: object) => {
        await BoardModule.createBoard(data)
        queryClient.invalidateQueries({ queryKey: ['boards'] })
        reset()
        setCreateNewBoard(false)
    }

    const onEditBoard = async (id: string, formData: FormData) => {
        await BoardModule.editBoard(id, formData)
        queryClient.invalidateQueries({ queryKey: ['boards'] })
        queryClient.invalidateQueries({ queryKey: ['selected-board'] })
    }
    return { boardData: { board: boardData?.data, boardLoading: boardData?.isLoading }, createBoard: { onBoardCreate, handleSubmit, register, errors, watch }, allBoardData, onEditBoard }
}
export default useBoard