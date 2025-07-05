import { ProductView } from '@/features/store/components/ProductView';
import { useParams } from 'react-router-dom';

const ProductRoutes = () => {
  const params = useParams();
  const productId = params.productId;
  const farmId = params.marketId;
  return <ProductView productId={productId} farmId={farmId} />;
};

export default ProductRoutes;
