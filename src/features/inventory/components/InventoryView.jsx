import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

import { Button } from '@/shared/components/ui/button';
import { Trash, Edit, X, PlusCircle, Package } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableActions } from '@/components/ui/TableActions';
import { useInventory } from '../api/GetInventory';
import { CreateItem } from './CreateItem';
import { DeleteItem } from './DeleteItem';
import { UpdateItem } from './UpdateItem';
import { AdjustStock } from './AdjustStock';
import { AdjustAvailable } from './AdjustAvailable';
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
          <AlertDialogTitle>Edit Inventory Item</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to this inventory item's data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UpdateItem itemId={data.id} closeForm={onClose} />
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
            This will permanently delete the inventory item
            <span className="font-bold"> {data?.name} </span>
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onClose}>Close</Button>
          <DeleteItem itemId={data.id} closeForm={onClose} />
        </AlertDialogFooter>
      </AlertDialogContent>
    ),
  },
  {
    key: 'adjust',
    label: 'Adjust Stock',
    icon: PlusCircle,
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
          <AlertDialogTitle>Adjust Stock Quantity</AlertDialogTitle>
          <AlertDialogDescription>
            Quickly add or remove stock for{' '}
            <span className="font-bold">{data?.name}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AdjustStock data={data} onClose={onClose} />
      </AlertDialogContent>
    ),
  },
  {
    key: 'adjustAmount',
    label: 'Adjust Amount/Unit',
    icon: Package,
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
          <AlertDialogTitle>Adjust Amount Per Unit</AlertDialogTitle>
          <AlertDialogDescription>
            Change the amount per unit for{' '}
            <span className="font-bold">{data?.name}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AdjustAvailable data={data} onClose={onClose} />
      </AlertDialogContent>
    ),
  },
];

export const InventoryView = () => {
  const { auth } = useAuth();
  const baseColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return (
          <p>
            {row.original.name} ({row.original.amount_per_unit}{' '}
            {row.original.unit})
          </p>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'stock_qty',
      header: 'Stock',
    },
    {
      accessorKey: 'total_available',
      header: 'Available',
      cell: ({ row }) => {
        return (
          <p>
            {row.original.total_available} {row.original.unit}
          </p>
        );
      },
    },
    {
      accessorFn: (row) => row.stock_qty * row.stock_price,
      id: 'estimated_value',
      header: 'Estimated Value',
      cell: ({ row }) => {
        const estVal = (
          row.original.stock_qty * row.original.stock_price
        ).toFixed(2);
        return <p>₱{estVal}</p>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const itemName = row.original.name;
        const availableActions =
          itemName === 'Copra' || itemName === 'Coconut'
            ? actions.filter((action) => action.key !== 'delete')
            : actions;
        return <TableActions row={row} actions={availableActions} />;
      },
    },
  ];

  const columns =
    auth?.user?.role === 'STAFF'
      ? baseColumns.filter((col) => col.id !== 'actions')
      : baseColumns;

  const inventoryQuery = useInventory({});

  if (inventoryQuery.isLoading) {
    return <DataTableSkeleton columns={4} rows={8} />;
  }

  let inventory = inventoryQuery?.data?.data?.inventory || [];

  const categoryOptions = [
    { label: 'Fertilizer', value: 'Fertilizer' },
    { label: 'Fungicide', value: 'Fungicide' },
    { label: 'Product', value: 'Product' },
    { label: 'Pesticide', value: 'Pesticide' },
  ];

  return (
    <DataTable
      columns={columns}
      data={inventory}
      CreateResource={CreateItem}
      filters={[
        {
          id: 'category',
          label: 'Category',
          type: 'select',
          options: categoryOptions,
        },
        {
          id: 'low_stock',
          label: 'Low Stock',
          type: 'select',
          options: [
            { label: 'Low Stock', value: 'low' },
            { label: 'Normal Stock', value: 'normal' },
          ],
          predicate: (row, val) => {
            console.log(row);
            if (val === 'low') return row.stock_qty <= row.low_stock_alert;
            if (val === 'normal') return row.stock_qty > row.low_stock_alert;
            return true;
          },
        },
      ]}
    />
  );
};
