import { DataTable } from '@/components/ui/DataTable';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { useSalesHistory } from '../api/GetSalesHistory';

export const SaleHistoryView = () => {
  const columns = [
    {
      accessorKey: 'order_id',
      header: 'Order ID',
      cell: ({ row }) => (
        <div className="font-medium">#{row.original.order_id}</div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => {
        const date = row.original.sale_items?.[0]?.created_at;
        return date ? new Date(date).toLocaleDateString() : 'N/A';
      },
    },
    {
      accessorKey: 'items_count',
      header: 'Items',
      cell: ({ row }) => `${row.original.sale_items?.length || 0} items`,
    },
    {
      accessorKey: 'amount',
      header: 'Order Total',
      cell: ({ row }) => `₱${Number(row.original.amount).toFixed(2)}`,
    },
    {
      accessorKey: 'net_amount',
      header: 'Net Amount',
      cell: ({ row }) => `₱${Number(row.original.net_amount).toFixed(2)}`,
    },
    {
      accessorKey: 'paypal_fee',
      header: 'PayPal Fee',
      cell: ({ row }) => `₱${Number(row.original.paypal_fee).toFixed(2)}`,
    },
  ];

  const salesQuery = useSalesHistory({});

  if (salesQuery.isLoading) {
    return <DataTableSkeleton columns={6} rows={8} />;
  }

  if (salesQuery.isError) {
    return (
      <div className="text-red-600 p-4">
        Error loading sales history. Please try again later.
      </div>
    );
  }

  let sales = salesQuery?.data?.data?.sales || [];

  return (
    <DataTable
      columns={columns}
      data={sales}
      searchColumn="order_id"
      searchPlaceholder="Search by order ID..."
      expandable={{
        renderExpanded: ({ row }) => (
          <div className="p-4 bg-gray-50 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm text-gray-600">Order Total</p>
                <p className="text-lg font-semibold">
                  ₱{Number(row.original.amount).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm text-gray-600">PayPal Fee</p>
                <p className="text-lg font-semibold text-red-600">
                  -₱{Number(row.original.paypal_fee).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm text-gray-600">Net Amount</p>
                <p className="text-lg font-semibold text-green-600">
                  ₱{Number(row.original.net_amount).toFixed(2)}
                </p>
              </div>
            </div>

            <h4 className="font-semibold mb-3 text-gray-700">Order Items:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-700">
                      Product Name
                    </th>
                    <th className="text-left p-3 font-medium text-gray-700">
                      Unit Price
                    </th>
                    <th className="text-left p-3 font-medium text-gray-700">
                      Quantity
                    </th>
                    <th className="text-left p-3 font-medium text-gray-700">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {row.original.sale_items?.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">
                        ₱{Number(item.unit_price).toFixed(2)}
                      </td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3 font-medium">
                        ₱{Number(item.subtotal).toFixed(2)}
                      </td>
                    </tr>
                  )) || []}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan="3"
                      className="p-3 text-right font-semibold text-gray-700"
                    >
                      Order Total:
                    </td>
                    <td className="p-3 font-bold text-gray-900">
                      ₱{Number(row.original.amount).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ),
      }}
    />
  );
};
