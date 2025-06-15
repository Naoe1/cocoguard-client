import { SidebarProvider, SidebarInset } from '@/shared/components/ui/sidebar';
import { AppSideBar } from '../ui/sidebar';
import { SiteHeader } from '../ui/SiteHeader';
export const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSideBar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
