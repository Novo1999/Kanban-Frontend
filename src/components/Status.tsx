import useGetBoard from '../hooks/useGetBoard'
import useWindowDimensions from '../hooks/useWindowDimension'

type status = Array<{
  name: string
  color: string
  count: number
}>

const status: status = [
  {
    name: 'TASK',
    color: 'bg-blue-400',
    count: 0,
  },
  {
    name: 'IN PROGRESS',
    color: 'bg-purple-500',
    count: 0,
  },
  {
    name: 'COMPLETED',
    color: 'bg-teal-200',
    count: 0,
  },
]

type StatusParam = {
  _id: string
  count: number
}

type Board = { data: { statusCount: Array<{ _id: string, count: number }> } }

const statusFinder = (board: Board, toFind: string) => {
  if (toFind === 'task')
    board?.data?.statusCount?.find(
      (status: StatusParam) => status._id === toFind
    )?.count || 0
  return board?.data?.statusCount?.find(
    (status: StatusParam) => status._id === toFind
  )?.count ||
    0 ||
    0
}

const Status = ({ type }: { type?: string }) => {
  const { data: board } = useGetBoard()
  const { width } = useWindowDimensions()

  status.map((item) => {
    if (item.name === 'TASK')
      item.count =
        statusFinder(board!, 'task')
    if (item.name === 'IN PROGRESS')
      item.count =
        statusFinder(board!, 'in progress')
    if (item.name === 'COMPLETED')
      item.count =
        statusFinder(board!, 'completed')
  })

  // individual status component for when the user is on mobile

  if (type === 'task') return (
    <div key={status[0].name} className='flex gap-2 items-center'>
      <div className={`w-4 h-4 rounded-2xl ${status[0].color}`}></div>
      <p className='font-semibold text-slate-400'>
        {status[0].name} ({status[0].count})
      </p>
    </div>
  )

  if (type === 'in progress') return (
    <div key={status[1].name} className='flex gap-2 items-center'>
      <div className={`w-4 h-4 rounded-2xl ${status[1].color}`}></div>
      <p className='font-semibold text-slate-400'>
        {status[1].name} ({status[1].count})
      </p>
    </div>
  )

  if (type === 'completed') return (
    <div key={status[2].name} className='flex gap-2 items-center'>
      <div className={`w-4 h-4 rounded-2xl ${status[2].color}`}></div>
      <p className='font-semibold text-slate-400'>
        {status[2].name} ({status[2].count})
      </p>
    </div>
  )

  // all status in a row when user on pc
  if (width > 1000)
    return (
      <div className='grid gap-4 sm:grid-cols-3 text-sm'>
        {status.map((status) => (
          <div key={status.name} className='flex gap-2 items-center'>
            <div className={`w-4 h-4 rounded-2xl ${status.color}`}></div>
            <p className='font-semibold text-slate-400'>
              {status.name} ({status.count})
            </p>
          </div>
        ))}
      </div>
    )
}
export default Status
