import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Landing } from './routes/Landing';
import MainErrorFallback from '@/components/errors/Main';
import { LoginRoute } from './routes/app/auth/Login';
import { RegisterRoute } from './routes/app/auth/Register';
import { AppRoot } from './routes/app/Root';
import { DashboardRoute } from './routes/app/Dashboard';
import { ProtectedRoute } from '@/lib/auth';
import { CoconutRoot } from './routes/app/coconuts/Root';
import CoconutsRoutes from './routes/app/coconuts/Coconuts';
import CoconutRoutes from './routes/app/coconuts/Coconut';
import { PersistLogin } from '@/lib/PersistLogin';

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
    {
      path: '/app',
      element: (
        <PersistLogin>
          <ProtectedRoute>
            <AppRoot />
          </ProtectedRoute>
        </PersistLogin>
      ),
      errorElement: <MainErrorFallback />,
      children: [
        {
          path: '',
          element: <DashboardRoute />,
        },
        {
          path: 'coconuts',
          element: <CoconutRoot />,
          children: [
            {
              path: '',
              element: <CoconutsRoutes />,
            },
            {
              path: ':coconutId',
              element: <CoconutRoutes />,
            },
          ],
        },
      ],
    },
  ]);
};
