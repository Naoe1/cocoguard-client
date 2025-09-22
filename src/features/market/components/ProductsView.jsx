import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { Trash, Edit, X, Image as ImageIcon } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableActions } from '@/components/ui/TableActions';
import { useProducts } from '../api/GetProducts';
import { CreateProduct } from './CreateProduct';
import { DeleteProduct } from './DeleteProduct';
import { UpdateProduct } from './UpdateProduct';
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
          <AlertDialogTitle>Edit Product</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to this product's details.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UpdateProduct productId={data.id} closeForm={onClose} />
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
            This will permanently delete the product
            <span className="font-bold"> {data?.inventory?.name} </span>
            from the market listing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <DeleteProduct
            productId={data.id}
            productName={data?.inventory?.name}
            closeForm={onClose}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    ),
  },
];

export const ProductsView = () => {
  const { auth } = useAuth();
  const baseColumns = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const imageUrl = row.original.image;
        return imageUrl ? (
          <img
            src={imageUrl}
            alt={row.original.name}
            className="h-10 w-10 object-cover rounded"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded text-gray-400">
            <ImageIcon size={20} />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: 'Name',
      accessorFn: (row) => {
        return row.original.inventory.name || '';
      },
      cell: ({ row }) => {
        const { name, unit, amount_per_unit } = row.original.inventory;
        return (
          <span className="line-clamp-2">
            {name} ({amount_per_unit} {unit})
          </span>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.original.description;
        return <span className="line-clamp-2">{description || '-'}</span>;
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const price = row.original.price;
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'PHP',
        }).format(price);
      },
    },
    {
      accessorKey: 'amount_to_sell',
      header: 'Current Sell Stock',
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        if (auth?.user?.role === 'STAFF') return null;
        return <TableActions row={row} actions={actions} />;
      },
    },
  ];

  const columns =
    auth?.user?.role === 'STAFF'
      ? baseColumns.filter((col) => col.id !== 'actions')
      : baseColumns;

  const productsQuery = useProducts({});

  if (productsQuery.isLoading) {
    return <DataTableSkeleton columns={5} rows={8} />;
  }

  if (productsQuery.isError) {
    return (
      <div className="text-red-600 p-4">
        Error loading products. Please try again later.
      </div>
    );
  }

  let products = productsQuery?.data?.data?.products || [];

  return (
    <DataTable
      columns={columns}
      data={products}
      CreateResource={CreateProduct}
      createResourceButtonText="Add New Product"
      searchColumn="name"
      searchPlaceholder="Search products..."
    />
  );
};
