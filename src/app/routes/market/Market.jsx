import { StoreView } from '@/features/store/components/StoreView';
import { useParams } from 'react-router-dom';

const MarketRoutes = () => {
  const params = useParams();
  const farmId = params.marketId;
  return <StoreView farmId={farmId} />;
};

export default MarketRoutes;
