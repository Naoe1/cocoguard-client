import { CoconutsLayout } from '@/components/layout/CoconutsLayout';
import { Outlet } from 'react-router-dom';

export const CoconutRoot = () => {
  return (
    <CoconutsLayout>
      <Outlet />
    </CoconutsLayout>
  );
};
