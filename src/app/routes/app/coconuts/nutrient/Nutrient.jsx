import { NutrientsView } from '@/features/nutrient/components/NutrientsView';
import { useSearchParams } from 'react-router-dom';

const NutrientsRoutes = () => {
  const [searchParams] = useSearchParams();
  const coconutId = searchParams.get('coconutId');
  const queryParams = {};
  if (coconutId) {
    queryParams.coconutId = coconutId;
  }
  return <NutrientsView queryParams={queryParams} />;
};

export default NutrientsRoutes;
