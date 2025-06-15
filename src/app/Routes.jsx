import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Landing } from './routes/Landing';
import MainErrorFallback from '@/components/errors/Main';
export const createRouter = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
      errorElement: <MainErrorFallback />,
    },
  ]);
};
