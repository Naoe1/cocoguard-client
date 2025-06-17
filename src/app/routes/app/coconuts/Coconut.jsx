import { CoconutView } from '@/features/coconuts/components/CoconutView';
import { useParams } from 'react-router-dom';

const CoconutRoutes = () => {
  const params = useParams();
  const coconutId = params.coconutId;
  return <CoconutView coconutId={coconutId} />;
};

export default CoconutRoutes;
