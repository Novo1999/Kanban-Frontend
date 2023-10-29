import { useDrag, useDrop } from 'react-dnd';
import useGetBoard from '../hooks/useGetBoard';
import { useKanban } from '../pages/KanbanBoard';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { editTaskStatus } from '../utils/editTaskStatus';
import { MdDragIndicator } from 'react-icons/md'
import { OPTIONS } from '../constants';
import toast from 'react-hot-toast';
import { Spinner } from '.';
import useWindowDimensions from '../hooks/useWindowDimension';



const Task = ({ statusType }: { statusType: string }) => {
  const { data: board, isLoading } = useGetBoard();

  // state for ui changes
  const [dragCategory, setDragCategory] = useState('');

  // task container is the drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: () => ({ status: statusType }),
    collect: monitor => ({
      isOver: monitor.isOver(),
    })
  }))

  // container style
  const taskContainerStyle = `p-4 transition-colors duration-300 ${isOver && dragCategory !== statusType && 'animate-pulse animate-duration-500 bg-cyan-800 border-4'} ${dragCategory !== statusType ? 'border-2 border-cyan-500 border-opacity-80 min-h-[20rem]' : ''} rounded-xl`

  return isLoading ? (
    <div className='flex justify-center items-center min-h-[35rem]'>
      <Spinner />
    </div>
  ) : (
    <div ref={drop} className={taskContainerStyle}>
      {/* destructured tasks properties */}
      {board?.data?.tasks?.map(({ title, subtasks, _id: id, status }: { title: string, subtasks: [{ name: string, status: string, _id: string }], _id: string, status: string }) => {
        if (status === statusType) {
          return (
            <DraggableTask
              key={id}
              id={id}
              title={title}
              subtasks={subtasks}
              status={status}
              setDragCategory={setDragCategory}
              statusType={statusType}
            />
          );
        }
      })}
    </div>
  );
};

type DraggableTaskProp = {
  id: string,
  title: string,
  subtasks: [{ name: string, status: string, _id: string }]
  , status: string,
  setDragCategory: (arg: string) => string | void,
  statusType: string
}

const DraggableTask = ({
  id,
  title,
  subtasks,
  status,
  setDragCategory,
  statusType
}: DraggableTaskProp) => {
  const { setIsTaskDetailsOpen, setSelectedTask, selectedBoard } = useKanban();
  const queryClient = useQueryClient();
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450
  // api patch request so the status of the tasks changes 
  const changeTaskStatus = async (selectedTask: string, newStatus: string) => {
    const updatedStatus = { status: newStatus }
    await editTaskStatus(selectedBoard, selectedTask, updatedStatus)
    toast.success(`Moved to ${newStatus.slice(0, 1).toUpperCase() + newStatus.slice(1)}`)
    queryClient.invalidateQueries({ queryKey: ['selected-board'] })
  }
  // making the tasks draggable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { selectedTask: id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const { selectedTask } = item
      // if dropped outside of the target, no request will happen
      if (!monitor.getDropResult()) return
      const { status }: { status: string } = monitor.getDropResult()!
      // if dropped on the same container, no request will happen
      if (status === statusType) return
      changeTaskStatus(selectedTask, status)
    }
  }))

  // setting different task color 
  const setTaskColor = () => {
    switch (status) {
      case OPTIONS[0]:
        return 'bg-sky-500'
      case OPTIONS[1]:
        return 'bg-purple-500'
      case OPTIONS[2]:
        return 'bg-teal-400'
    }
  }

  return (
    <div
      ref={drag}
      onClick={() => {
        setIsTaskDetailsOpen(true);
        setSelectedTask(id);
      }}
      onDragStart={() => {
        setSelectedTask(id);
        setDragCategory(status);
      }}
      onDragEnd={() => {
        setDragCategory('');
      }}
      className={`mb-10 ${setTaskColor()} ${isDragging && 'scale-105 bg-blue-600 transition-all duration-300'} p-4 rounded-lg cursor-pointer flex items-center justify-between`}
    >
      <div className='break-all'>
        <h4 className='text-white font-semibold drop-shadow-lg'>
          {title}
        </h4>
        <p className={` ${status === OPTIONS[2] ? 'text-gray-600' : 'text-gray-300'} font-medium drop-shadow-lg text-sm`}>
          {`${subtasks.length} subtasks(${subtasks.filter(t => t.status === 'done').length} completed) `}
        </p>
      </div>
      {!onMobile && <div className='cursor-grab'>
        <MdDragIndicator />
      </div>}

    </div>
  );
};

export default Task;
