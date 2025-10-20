import { SquareTerminal, BookOpen, Store, PalmtreeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { NavMain } from './NavMain';
import { NavUser } from './NavUser';
import { useAuth } from '@/lib/auth';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';

export const AppSideBar = ({ ...props }) => {
  const { auth, logout } = useAuth();
  const data = {
    navMain: [
      {
        title: 'Plantation',
        url: '#',
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: 'Coconuts',
            url: './coconuts',
          },
          {
            title: 'Harvests',
            url: './coconuts/harvests',
          },
          {
            title: 'Treatments',
            url: './coconuts/treatments',
          },
          {
            title: 'Nutrients',
            url: './coconuts/nutrients',
          },
        ],
      },
      ...(auth?.user?.role !== 'STAFF'
        ? [
            {
              title: 'Market',
              url: '#',
              icon: Store,
              items: [
                {
                  title: 'Market Dashboard',
                  url: './market',
                },
                {
                  title: 'Products',
                  url: './market/products',
                },
                {
                  title: 'Sale History',
                  url: './market/sale-history',
                },
                {
                  title: 'Online Store',
                  url: '/market/' + auth?.user?.farmId,
                },
              ],
            },
          ]
        : []),
      {
        title: 'Resource Hub',
        icon: BookOpen,
        items: [
          {
            title: 'Planting Guide',
            url: './guide/planting',
          },
          {
            title: 'Nutrient Management',
            url: './guide/nutrients',
          },
          {
            title: 'Pest and Disease Guide',
            url: './guide/pests-and-diseases',
          },
        ],
      },
    ],
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <PalmtreeIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Cocoguard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser auth={auth} logout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
};
