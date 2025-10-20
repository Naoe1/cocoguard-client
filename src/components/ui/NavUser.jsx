import {
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui/sidebar';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';

import { Link } from 'react-router-dom';

export const NavUser = ({ auth, logout }) => {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer w-full">
              <div className="flex items-center w-full p-2 rounded-md hover:bg-muted/50">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage
                    alt={`${auth.user.firstName} ${auth.user.lastName} `}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-medium">{`${auth.user.firstName} ${auth.user.lastName} `}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {auth.user.email}
                  </span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    alt={`${auth.user.firstName} ${auth.user.lastName} `}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{`${auth.user.firstName} ${auth.user.lastName} `}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {auth.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/app/account">
                  <UserCircleIcon className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link to="/app/billing">
                  <CreditCardIcon className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </Link>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
