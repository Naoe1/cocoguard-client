import { MarketDashboardView } from '@/features/market/components/MarketDashboardView';

export const MarketRouteAdmin = () => {
  return (
    <div className="flex flex-col">
      <div className="p-4">
        <MarketDashboardView />
      </div>
    </div>
  );
};
