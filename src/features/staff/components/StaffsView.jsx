import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

import { Button } from '@/shared/components/ui/button';
import { Trash, Edit, X } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableActions } from '@/components/ui/TableActions';
import { useStaffs } from '../api/GetStaffs';
import { CreateStaff } from './CreateStaff';
import { DeleteStaff } from './DeleteStaff';
import { UpdateStaff } from './UpdateStaff';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
const actions = [
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit,
    renderDialog: ({ data, onClose }) => (
      <AlertDialogContent>
        <AlertDialogHeader className="relative">
          <Button
            variant="ghost"
            className="absolute right-2 top-2 h-8 w-8 p-0 rounded-full"
            onClick={onClose}
          >
            <X />
            <span className="sr-only">Close</span>
          </Button>
          <AlertDialogTitle>Edit Staff Member</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to this staff member's data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UpdateStaff staffId={data.id} closeForm={onClose} />
      </AlertDialogContent>
    ),
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash,
    renderDialog: ({ data, onClose }) => (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the staff member
            <span className="font-bold">
              {data?.first_name} {data?.last_name}{' '}
            </span>
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onClose}>Close</Button>
          <DeleteStaff staffId={data.id} closeForm={onClose} />
        </AlertDialogFooter>
      </AlertDialogContent>
    ),
  },
];

export const StaffsView = () => {
  const columns = [
    {
      accessorKey: 'first_name',
      header: 'First Name',
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return <TableActions row={row} actions={actions} />;
      },
    },
  ];

  const staffsQuery = useStaffs({});

  if (staffsQuery.isLoading) {
    return <DataTableSkeleton columns={4} rows={8} />;
  }

  let staffs = staffsQuery?.data?.data?.staff || [];

  return (
    <DataTable columns={columns} data={staffs} CreateResource={CreateStaff} />
  );
};
