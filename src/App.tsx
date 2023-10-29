import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const App = () => {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Toaster />
        <Outlet />
      </DndProvider>
    </div>
  )
}
export default App
