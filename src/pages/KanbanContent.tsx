import { useEffect } from 'react';
import { BoardItem, Status, TaskDetails } from '../components/index';
import InviteUser from '../components/InviteUser'; // Import the new component
import useWindowDimensions from '../hooks/useWindowDimension';
import { useKanban } from '../pages/KanbanBoard';

const KanbanContent = () => {
  const { showAddNewModal, showDeleteBoardModal, isTaskDetailsOpen, isSidebarOpen } = useKanban()
  const windowDimensions = useWindowDimensions()
  const onMobile = windowDimensions.width < 450

  // hiding scrollbar when add task modal opens
  useEffect(() => {
    if (!showDeleteBoardModal && !showAddNewModal && !isTaskDetailsOpen) document.body.style.overflow = 'visible'
    else document.body.style.overflow = 'hidden'
  }, [showAddNewModal, showDeleteBoardModal, isTaskDetailsOpen])

  return (
    <section className={`m-auto mt-36 ${isSidebarOpen && !onMobile && 'ml-80'}`}>
      <InviteUser />
      <Status />
      <BoardItem />
      {isTaskDetailsOpen && <TaskDetails />}
    </section>
  )
}

export default KanbanContent
