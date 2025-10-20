import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

import { useCoconuts } from '../api/GetCoconuts';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Trash, Edit, X } from 'lucide-react';
import { DeleteCoconut } from './DeleteCoconut';
import { DataTable } from '@/components/ui/DataTable';
import { CreateCoconut } from '@/features/coconuts/components/CreateCoconut';
import { UpdateCoconut } from './UpdateCoconut';
import { TableActions } from '@/components/ui/TableActions';
import { useAuth } from '@/lib/auth';
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
          <AlertDialogTitle>Edit {data.tree_code}</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to this tree's data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UpdateCoconut coconutId={data.id} closeForm={onClose} />
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
            This will permanently delete{' '}
            <span className="font-bold">tree </span>
            {data.tree_code} from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onClose}>Close</Button>
          <DeleteCoconut coconutId={data.id} />
        </AlertDialogFooter>
      </AlertDialogContent>
    ),
  },
];

export const CoconutsView = () => {
  const { auth } = useAuth();
  const baseColumns = [
    {
      accessorKey: 'tree_seq',
      header: 'Tree ID',
      cell: ({ row }) => {
        const tree_seq = row.getValue('tree_seq');
        const coconutId = row.original.id;
        return (
          <Link
            to={`/app/coconuts/${coconutId}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {tree_seq}
          </Link>
        );
      },
    },
    {
      accessorKey: 'tree_code',
      header: 'Tree Nickname',
    },
    {
      accessorKey: 'planting_date',
      header: 'Planting Date',
    },
    {
      accessorKey: 'harvest',
      header: 'Last Harvest Date',
      cell: ({ row }) => {
        const harvest = row.original.harvest;
        if (harvest && harvest.length > 0) {
          const harvestDate = new Date(harvest[0].harvest_date);
          return harvestDate.toISOString().split('T')[0];
        }
        return '-';
      },
    },
    {
      accessorKey: 'harvest',
      header: 'Last Harvest Weight (kg)',
      id: 'total_weight',
      cell: ({ row }) => {
        const harvest = row.original.harvest;
        if (harvest && harvest.length > 0) {
          return harvest[0].total_weight || 0;
        }
        return '-';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return <TableActions row={row} actions={actions} />;
      },
    },
  ];

  const columns =
    auth?.user?.role === 'STAFF'
      ? baseColumns.filter((col) => col.id !== 'actions')
      : baseColumns;

  const coconutQuery = useCoconuts({});

  if (coconutQuery.isLoading) {
    return <DataTableSkeleton columns={4} rows={8} />;
  }

  if (coconutQuery.isError) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        Something Went Wrong!
      </div>
    );
  }
  let coconuts = coconutQuery?.data?.data?.coconuts || [];

  const categoryOptions = [
    { label: 'Healthy', value: 'Healthy' },
    { label: 'Diseased', value: 'Diseased' },
  ];
  return (
    <>
      <DataTable
        columns={columns}
        data={coconuts}
        CreateResource={CreateCoconut}
        filters={[
          {
            id: 'status',
            label: 'Status',
            type: 'select',
            options: categoryOptions,
          },
        ]}
      />
    </>
  );
};
