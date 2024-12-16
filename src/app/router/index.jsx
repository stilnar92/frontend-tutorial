import React from 'react';
import { createBrowserRouter, redirect } from 'react-router-dom';
import { HomePage, LoginPage } from '@/pages';
import { useSessionStore } from '@/entities/session/store/sessionStore';

// Auth check loader
const protectedLoader = async () => {
  const checkAuth = useSessionStore.getState().checkAuth;
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    return redirect('/login');
  }
  return null;
};

// Guest loader (for login page)
const guestLoader = async () => {
  const checkAuth = useSessionStore.getState().checkAuth;
  const isAuthenticated = await checkAuth();
  
  if (isAuthenticated) {
    return redirect('/');
  }
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    loader: protectedLoader,
  },
  {
    path: '/login',
    element: <LoginPage />,
    loader: guestLoader,
  },
]);
