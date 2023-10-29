import { DeleteModal } from '.'
const DeleteTask = ({ setShowDeleteTask }: { setShowDeleteTask: (arg: boolean) => boolean | void }) => {
 return (
  <div className='min-h-[30rem] flex justify-center items-center'>
   <DeleteModal setShowDeleteTask={setShowDeleteTask} type='task' />
  </div>
 )
}
export default DeleteTask
