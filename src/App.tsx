import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'

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
