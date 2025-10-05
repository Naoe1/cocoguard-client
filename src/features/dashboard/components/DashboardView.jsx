import { YieldChartView } from './YieldChartView';
import { SummaryCard } from './SummaryCard';
import { InventoryCategoryChart } from './InventoryCategoryChart';
import { LowStockItems } from './LowStockItems';
import { useStats } from '../api/GetStats';
import { useStaffStats } from '../api/GetStaffStats';
import { Trees, Users, Package, Package2 } from 'lucide-react';
import { useCoconutsStats } from '../api/GetCoconutsStats';
import { useInventoryStats } from '../api/GetInventoryStats';
import { useHarvestStats } from '../api/GetHarvestStats';

export const DashboardView = () => {
  const staffStatsQuery = useStaffStats();
  let staffStats = staffStatsQuery.data?.data.staff;
  const coconutStatsQuery = useCoconutsStats();
  let coconutStats = coconutStatsQuery.data?.data.coconut;
  const inventoryStatsQuery = useInventoryStats();
  let inventoryStats = inventoryStatsQuery.data?.data.inventory;
  const inventoryCategoryData =
    inventoryStatsQuery.data?.data?.inventory?.categoryCounts || {};
  const lowStockItemsData =
    inventoryStatsQuery.data?.data?.inventory?.lowStockItems || [];
  const harvestStatsQuery = useHarvestStats();
  let harvestStats = harvestStatsQuery.data?.data.harvest;

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title={'Total Trees'}
          icon={<Trees className="h-4 w-4 text-muted-foreground" />}
          value={coconutStats?.count || 0}
          change={`+${coconutStats?.newTrees || 0} new trees since last month`}
          isLoading={coconutStatsQuery.isLoading}
        />
        <SummaryCard
          title={'Active Staff'}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          value={staffStats?.count || 0}
          change={
            staffStats?.newHires !== 1
              ? `+${staffStats?.newHires || 0} new hires`
              : ''
          }
          isLoading={staffStatsQuery.isLoading}
        />
        <SummaryCard
          title={'Inventory Items'}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          value={inventoryStats?.count || 0}
          change={`${inventoryStats?.lowStockCount || 0} low stock items`}
          isLoading={inventoryStatsQuery.isLoading}
        />
        <SummaryCard
          title={'Total Harvest (kg)'}
          icon={<Package2 className="h-4 w-4 text-muted-foreground" />}
          value={coconutStats?.totalHarvestWeight || 0}
          isLoading={coconutStatsQuery.isLoading}
        />
      </div>

      <YieldChartView
        harvestData={harvestStats?.recentHarvests}
        isLoading={harvestStatsQuery.isLoading}
      />

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3 xl:gap-8">
        <div className="lg:col-span-1">
          <InventoryCategoryChart
            inventoryCategoryData={inventoryCategoryData}
            isLoading={inventoryStatsQuery.isLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <LowStockItems
            lowStockItems={lowStockItemsData}
            isLoading={inventoryStatsQuery.isLoading}
          />
        </div>
      </div>
    </div>
  );
};
