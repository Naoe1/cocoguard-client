import { AlertDialog } from '@/shared/components/ui/alert-dialog';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export const TableActions = ({ row, actions }) => {
  const data = row.original;
  const [dialogState, setDialogState] = useState({});

  const openDialog = (key) =>
    setDialogState((prev) => ({ ...prev, [key]: true }));
  const closeDialog = (key) =>
    setDialogState((prev) => ({ ...prev, [key]: false }));

  return (
    <>
      {actions.map(({ key, renderDialog }) => (
        <AlertDialog
          key={key}
          open={dialogState[key]}
          onOpenChange={(open) =>
            setDialogState((prev) => ({ ...prev, [key]: open }))
          }
        >
          {renderDialog({ data, onClose: () => closeDialog(key) })}
        </AlertDialog>
      ))}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map(({ key, label, icon: Icon }) => (
            <DropdownMenuItem key={key} onSelect={() => openDialog(key)}>
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
