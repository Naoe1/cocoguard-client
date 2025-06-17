export const DashboardView = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight">CocoGuard Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Coconut Stock</h3>
          <p className="mt-2 text-3xl font-bold">1,245 units</p>
          <p className="text-sm text-muted-foreground">+15% from last month</p>
        </div>
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold">$12,452</p>
          <p className="text-sm text-muted-foreground">+8% from last month</p>
        </div>
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Active Farms</h3>
          <p className="mt-2 text-3xl font-bold">24</p>
          <p className="text-sm text-muted-foreground">+3 since last month</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Recent Harvests</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pb-2 text-left">Farm</th>
              <th className="pb-2 text-left">Date</th>
              <th className="pb-2 text-right">Quantity</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Green Grove Farm</td>
              <td className="py-2">2023-06-15</td>
              <td className="py-2 text-right">250kg</td>
              <td className="py-2 text-right">Completed</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Tropical Paradise</td>
              <td className="py-2">2023-06-12</td>
              <td className="py-2 text-right">180kg</td>
              <td className="py-2 text-right">Processing</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Ocean Breeze Plantation</td>
              <td className="py-2">2023-06-10</td>
              <td className="py-2 text-right">320kg</td>
              <td className="py-2 text-right">Completed</td>
            </tr>
            <tr>
              <td className="py-2">Sunny Hills Co-op</td>
              <td className="py-2">2023-06-08</td>
              <td className="py-2 text-right">120kg</td>
              <td className="py-2 text-right">Completed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
