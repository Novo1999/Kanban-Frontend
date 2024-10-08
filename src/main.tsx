import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'tailwindcss/tailwind.css'
import { action as loginAction } from './actions/loginAction.ts'
import { action as registerAction } from './actions/registerAction.ts'
import App from './App.tsx'
import './index.css'
import { loader as homeLoader } from './loaders/homeLoader.ts'
import { Error, KanbanBoard, Login, Register, Settings } from './pages/index.ts'
import { loader as loginLoader } from './pages/Login.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
