import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Suspense } from 'react';
import { Toaster } from '@/shared/components/ui/sonner';

export const AppRoot = () => {
  return (
    <Suspense
      fallback={
        <div className="flex size-full items-center justify-center">
          Loading
        </div>
      }
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
      <Toaster richColors theme="light" position="bottom-left" />
    </Suspense>
  );
};
