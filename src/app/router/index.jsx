import React from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'
import { HomePage, LoginPage } from '@/pages'
import { sessionApi } from '@/entities/session/api/sessionApi'

// Auth check loader
const authLoader = async () => {
  try {
    await sessionApi.check()
    return null
  } catch (error) {
    return redirect('/login')
  }
}

// Guest loader (for login page)
const guestLoader = async () => {
  try {
    await sessionApi.check()
    return redirect('/')
  } catch (error) {
    return null
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    loader: authLoader
  },
  {
    path: '/login',
    element: <LoginPage />,
    loader: guestLoader
  }
])
