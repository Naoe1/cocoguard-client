import { HarvestsView } from '@/features/harvest/components/HarvestsView';
import { useSearchParams } from 'react-router-dom';

const HarvestsRoutes = () => {
  const [searchParams] = useSearchParams();
  const coconutId = searchParams.get('coconutId');
  const queryParams = {};
  if (coconutId) {
    queryParams.coconutId = coconutId;
  }

  return <HarvestsView queryParams={queryParams} />;
};

export default HarvestsRoutes;
