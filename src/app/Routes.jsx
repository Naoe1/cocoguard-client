import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Landing } from './routes/Landing';
import MainErrorFallback from '@/components/errors/Main';
import { LoginRoute } from './routes/auth/Login';
import { RegisterRoute } from './routes/auth/Register';
import { ForgotRoute } from './routes/auth/Forgot';
import { UpdatePasswordRoute } from './routes/auth/UpdatePassword';
import { AppRoot } from './routes/app/Root';
import { DashboardRoute } from './routes/app/Dashboard';
import { ProtectedRoute } from '@/lib/auth';
import { CoconutRoot } from './routes/app/coconuts/Root';
import CoconutsRoutes from './routes/app/coconuts/Coconuts';
import CoconutRoutes from './routes/app/coconuts/Coconut';
import { PersistLogin } from '@/lib/PersistLogin';
import InventoryRoutes from './routes/app/inventory/Inventory';
import HarvestsRoutes from './routes/app/coconuts/harvest/Harvests';
import TreatmentRoutes from './routes/app/coconuts/treatment/Treatment';
import NutrientsRoutes from './routes/app/coconuts/nutrient/Nutrient';

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
      path: '/auth/forgot',
      element: <ForgotRoute />,
      errorElement: <MainErrorFallback />,
    },
    {
      path: '/auth/update-password',
      element: <UpdatePasswordRoute />,
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
          path: 'inventory',
          element: <InventoryRoutes />,
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
            {
              path: 'harvests',
              element: <HarvestsRoutes />,
            },
            {
              path: 'treatments',
              element: <TreatmentRoutes />,
            },
            {
              path: 'nutrients',
              element: <NutrientsRoutes />,
            },
          ],
        },
      ],
    },
  ]);
};
