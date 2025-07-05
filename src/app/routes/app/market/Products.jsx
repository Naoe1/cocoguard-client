import { ProductsView } from '@/features/market/components/ProductsView';

export const ProductsRouteAdmin = () => {
  return (
    <div className="flex flex-col">
      <div className="p-4">
        <ProductsView />
      </div>
    </div>
  );
};
