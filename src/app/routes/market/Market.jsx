import { StoreView } from '@/features/store/components/StoreView';
import { useParams } from 'react-router-dom';

const MarketRoutes = () => {
  const params = useParams();
  const farmId = params.marketId;
  return (
    <>
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-lg p-6 mb-8 text-gray-50 shadow-md">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
          Welcome to <span className="text-gray-200">Farm {farmId}</span>!
        </h1>
        <p className="text-gray-100 max-w-2xl">
          We offer the finest coconut products, freshly harvested and carefully
          processed to bring you the authentic taste of the Philippines.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-900">Our Products</h2>
      <StoreView farmId={farmId} />
    </>
  );
};

export default MarketRoutes;
