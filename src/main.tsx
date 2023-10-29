import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login, KanbanBoard, Error, Register, Settings } from './pages/index.ts'
import { action as registerAction } from './actions/registerAction.ts'
import { action as loginAction } from './actions/loginAction.ts'
import { loader as homeLoader } from './loaders/homeLoader.ts'
import { loader as loginLoader } from './pages/Login.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import KanbanContent from './pages/KanbanContent.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Login />,
        action: loginAction,
        loader: loginLoader,
      },
      {
        path: '/register',
        element: <Register />,
        action: registerAction,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '/kanban',
        element: <KanbanBoard />,
        loader: homeLoader,
        children: [
          {
            path: 'kanban-board/:id',
            element: <KanbanContent />,
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
)
