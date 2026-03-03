import React from 'react'
import './features/shared/global.scss'
import { RouterProvider } from 'react-router-dom'
import { router } from './app.routes'
import { AuthProvider } from './features/auth/auth.context'

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App