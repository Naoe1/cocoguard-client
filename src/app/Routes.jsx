import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Landing } from './routes/Landing';
import MainErrorFallback from '@/components/errors/Main';
import { LoginRoute } from './routes/app/auth/Login';
import { RegisterRoute } from './routes/app/auth/Register';
export const createRouter = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
      errorElement: <MainErrorFallback />,
    },
    {
      path: '/auth/login',
      element: <LoginRoute />,
      errorElement: <MainErrorFallback />,
    },
    {
      path: '/auth/register',
      element: <RegisterRoute />,
      errorElement: <MainErrorFallback />,
    },
  ]);
};
