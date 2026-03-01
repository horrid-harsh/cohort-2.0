import React from 'react'
import './features/shared/global.scss'
import FaceExpression from './features/Expression/components/FaceExpression'
import { RouterProvider } from 'react-router-dom'
import { router } from './app.routes'

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App