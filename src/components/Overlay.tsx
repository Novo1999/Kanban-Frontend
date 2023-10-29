import { ReactNode, useRef } from 'react'
import { useKanban } from '../pages/KanbanBoard'

type Props = {
  children: ReactNode
}

const Overlay = ({ children }: Props) => {
  const { setShowAddNewModal, setShowDeleteBoardModal, setIsTaskDetailsOpen } =
    useKanban()

  const overlayRef = useRef < HTMLDivElement | null > (null)

  // clicking on overlay will disable the modals

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      setShowAddNewModal(false)
      setShowDeleteBoardModal(false)
      setIsTaskDetailsOpen(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className='h-full fixed top-0 bottom-0 right-0 left-0 z-20 w-full flex justify-center items-center bg-blue-900 bg-opacity-40 overlay'
    >
      {children}
    </div>
  )
}
export default Overlay
