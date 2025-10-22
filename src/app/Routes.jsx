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
import { DenyStaffAccess, ProtectedRoute } from '@/lib/auth';
import { CoconutRoot } from './routes/app/coconuts/Root';
import CoconutsRoutes from './routes/app/coconuts/Coconuts';
import CoconutRoutes from './routes/app/coconuts/Coconut';
import { PersistLogin } from '@/lib/PersistLogin';
import InventoryRoutes from './routes/app/inventory/Inventory';
import HarvestsRoutes from './routes/app/coconuts/harvest/Harvests';
import TreatmentRoutes from './routes/app/coconuts/treatment/Treatment';
import NutrientsRoutes from './routes/app/coconuts/nutrient/Nutrient';
import { PlantingGuide } from '@/features/guide/PlantingGuide';
import { NutrientManagement } from '@/features/guide/NutrientManagement';
import { PestAndDiseaseManagement } from '@/features/guide/PestAndDiseaseManagement';
import { StaffsRoute } from './routes/app/Staff';
import { AccountRoute } from './routes/app/Account';
import { MarketRoot } from './routes/market/Root';
import { MarketLanding } from './routes/market/Landing';
import MarketRoutes from './routes/market/Market';
import { MarketRouteAdmin } from './routes/app/market/Market';
import { ProductsRouteAdmin } from './routes/app/market/Products';
import ProductRoutes from './routes/market/Product';
import { CartView } from '@/features/store/components/CartView';
import { WeatherRoute } from './routes/app/Weather';
import { SaleHistoryRoute } from './routes/app/market/SaleHistory';
import { AuditLogsRoute } from './routes/app/AuditLogs';
import NotFound from '@/components/errors/NotFound';
import { WelcomeRoute } from './routes/auth/Welcome';
import { ConfirmRoute } from './routes/auth/Confirm';

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
      path: '/auth/welcome',
      element: <WelcomeRoute />,
      errorElement: <MainErrorFallback />,
    },
    {
      path: '/auth/update-password',
      element: <UpdatePasswordRoute />,
      errorElement: <MainErrorFallback />,
    },
    {
      path: '/auth/confirm',
      element: <ConfirmRoute />,
      errorElement: <MainErrorFallback />,
    },
    {
      path: '/market',
      element: <MarketLanding />,
    },
    {
      path: '/market/:marketId',
      element: <MarketRoot />,
      children: [
        {
          path: '',
          element: <MarketRoutes />,
        },
        {
          path: 'cart',
          element: <CartView />,
        },
        {
          path: ':productId',
          element: <ProductRoutes />,
        },
      ],
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
          path: 'account',
          element: <AccountRoute />,
        },
        {
          path: 'inventory',
          element: <InventoryRoutes />,
        },
        {
          path: 'staff',
          element: (
            <DenyStaffAccess>
              <StaffsRoute />
            </DenyStaffAccess>
          ),
        },
        {
          path: 'market',
          element: (
            <DenyStaffAccess>
              <MarketRouteAdmin />
            </DenyStaffAccess>
          ),
        },
        {
          path: 'market/products',
          element: (
            <DenyStaffAccess>
              <ProductsRouteAdmin />
            </DenyStaffAccess>
          ),
        },
        {
          path: 'market/sale-history',
          element: (
            <DenyStaffAccess>
              <SaleHistoryRoute />
            </DenyStaffAccess>
          ),
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
        {
          path: 'guide/planting',
          element: <PlantingGuide />,
        },
        {
          path: 'guide/nutrients',
          element: <NutrientManagement />,
        },
        {
          path: 'guide/pests-and-diseases',
          element: <PestAndDiseaseManagement />,
        },
        {
          path: 'weather',
          element: <WeatherRoute />,
        },
        {
          path: 'logs',
          element: (
            <DenyStaffAccess>
              <AuditLogsRoute />
            </DenyStaffAccess>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
};
