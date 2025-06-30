import { TreatmentsView } from '@/features/treatment/components/TreatmentsView';
import { useSearchParams } from 'react-router-dom';
const TreatmentRoutes = () => {
  const [searchParams] = useSearchParams();
  const coconutId = searchParams.get('coconutId');
  const queryParams = {};
  if (coconutId) {
    queryParams.coconutId = coconutId;
  }
  return <TreatmentsView queryParams={queryParams} />;
};

export default TreatmentRoutes;
