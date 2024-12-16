import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './styles/index.css'

export const App = () => {
  return <RouterProvider router={router} />
}
