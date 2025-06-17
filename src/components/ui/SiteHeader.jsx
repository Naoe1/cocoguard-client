import { Separator } from '@/shared/components/ui/separator';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { useLocation } from 'react-router-dom'; // Import useLocation

export const SiteHeader = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || 'Dashboard';
  const headerTitle =
    lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {headerTitle === 'App' ? 'Dashboard' : headerTitle}
        </h1>
      </div>
    </header>
  );
};
