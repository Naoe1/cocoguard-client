import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Trash, Edit, X } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableActions } from '@/components/ui/TableActions';
import { useHarvests } from '../api/GetHarvests';
import { CreateHarvest } from './CreateHarvest';
import { DeleteHarvest } from './DeleteHarvest';
import { UpdateHarvest } from './UpdateHarvest';
import { useAddHarvestToInventory } from '../api/AddHarvestToInventory';
import { toast } from 'sonner';
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
        <UpdateHarvest harvestId={data.id} closeForm={onClose} />
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
            This will permanently delete tree
            <span className="font-bold"> {data?.tree?.tree_code} </span>
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onClose}>Close</Button>
          <DeleteHarvest harvestId={data.id} closeForm={onClose} />
        </AlertDialogFooter>
      </AlertDialogContent>
    ),
  },
];

export const HarvestsView = ({ queryParams }) => {
  const { auth } = useAuth();
  const useAddHarvestToInventoryMutation = useAddHarvestToInventory({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Harvest added to inventory successfully');
      },
      onError: () => {
        toast.error('Failed to add harvest to inventory');
      },
    },
  });
  const addToInventory = (quantity, harvestId) => {
    useAddHarvestToInventoryMutation.mutate({
      data: {
        quantity,
        harvestId,
      },
    });
  };

  const baseColumns = [
    {
      accessorKey: 'trace_number',
      header: 'Harvest ID',
      cell: ({ row }) => {
        const harvest_id = row.getValue('trace_number');
        return <p>{harvest_id.slice(0, 8)}</p>;
      },
    },
    {
      accessorKey: 'harvest_date',
      header: 'Harvest Date',
      cell: ({ row }) => {
        const date = row.getValue('harvest_date');
        if (!date) return null;
        try {
          const formattedDate = new Date(date).toISOString().split('T')[0];
          return <span>{formattedDate}</span>;
        } catch (error) {
          return <span>{date}</span>;
        }
      },
    },
    {
      id: 'harvested_from',
      header: 'Harvested from',
      accessorFn: (row) => {
        return row.tree?.tree_code || '';
      },
      cell: ({ row }) => {
        const coconutId = row.original.tree.id;
        const treeCode = row.original.tree.tree_code;
        return (
          <Link
            to={`/app/coconuts/${coconutId}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {treeCode}
          </Link>
        );
      },
    },
    {
      accessorKey: 'total_weight',
      header: 'Weight (kg)',
    },
    {
      accessorKey: 'added_to_inventory',
      header: 'Add to inventory',
      cell: ({ row }) => {
        const addedToInventory = row.getValue('added_to_inventory');
        return (
          <span>
            {addedToInventory ? (
              'Added'
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled={useAddHarvestToInventoryMutation.isPending}
                onClick={() =>
                  addToInventory(row.original.total_weight, row.original.id)
                }
              >
                Add to Inventory
              </Button>
            )}
          </span>
        );
      },
    },
    {
      accessorKey: 'estimated_value',
      header: 'Estimated Value',
      cell: ({ row }) => {
        const estimatedValue = row.getValue('estimated_value');
        return <span>₱{estimatedValue.toFixed(2)}</span>;
      },
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

  const harvestsQuery = useHarvests({ params: queryParams });
  if (harvestsQuery.isLoading) {
    return <DataTableSkeleton columns={4} rows={8} />;
  }
  let harvests = harvestsQuery?.data?.data?.harvests || [];

  return (
    <DataTable
      columns={columns}
      data={harvests}
      CreateResource={CreateHarvest}
    />
  );
};
