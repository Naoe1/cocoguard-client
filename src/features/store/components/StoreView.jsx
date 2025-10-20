import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Image as ImageIcon } from 'lucide-react';
import { useStore } from '../api/GetStore';
import { Badge } from '@/shared/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export const StoreView = ({ farmId }) => {
  const storeQuery = useStore({ farmId });
  const products = storeQuery?.data?.data.products || [];
  const navigate = useNavigate();

  if (storeQuery.isLoading) {
    return (
      <div className="w-full">
        <div className="bg-gray-200 animate-pulse rounded-lg p-6 mb-8 h-32"></div>
        <div className="h-8 w-48 bg-gray-200 animate-pulse mb-6 rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <Card
              key={index}
              className="flex flex-col overflow-hidden border w-full h-[280px]"
            >
              <CardHeader className="p-0 relative">
                <div className="h-48 w-full bg-gray-200 animate-pulse" />
              </CardHeader>
              <CardContent className="flex-grow p-4 text-center">
                <div className="h-6 w-3/4 mx-auto bg-gray-200 animate-pulse mb-2 rounded" />
                <div className="h-5 w-1/3 mx-auto bg-gray-200 animate-pulse mt-3 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (storeQuery.isError) {
    const error = storeQuery.error;
    const is404 = error?.response?.status === 404;

    return (
      <div className="w-full py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {is404 ? 'Store Not Found' : 'Error Loading Store'}
        </h2>
        <p className="text-gray-600 mb-6">
          {is404
            ? "The store you're looking for doesn't exist or you don't have access to it."
            : `Unable to load store data. ${
                error?.message || 'Please try again later.'
              }`}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

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
      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 place-items-center">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200 ease-in-out bg-white hover:scale-[1.01] h-full w-full cursor-pointer"
              onClick={() => navigate(`./${product.id}`)}
            >
              <CardHeader className="p-0 relative h-48 min-h-[12rem] max-h-48 overflow-hidden bg-gray-50 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.inventory?.name || 'Product image'}
                    className="max-h-full max-w-full object-contain object-center"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const placeholder =
                        e.currentTarget.parentElement?.querySelector(
                          '.image-placeholder',
                        );
                      if (placeholder) placeholder.style.display = 'flex';
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <div
                  className={`image-placeholder absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-300 ${
                    product.image ? 'hidden' : 'flex'
                  }`}
                  style={!product.image ? { display: 'flex' } : {}}
                >
                  <ImageIcon size={40} />
                </div>

                {product.amount_to_sell > 0 ? (
                  <Badge className="absolute top-2 right-2 bg-gray-800 text-white text-xs py-0.5">
                    {product.amount_to_sell} in stock
                  </Badge>
                ) : (
                  <Badge className="absolute top-2 right-2 bg-red-600 text-white text-xs py-0.5">
                    Out of stock
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex-grow text-center flex flex-col justify-between">
                <CardTitle className="text-base md:text-lg font-medium text-gray-900 line-clamp-2">
                  {product.inventory?.name || 'Unnamed Product'}
                  {product.inventory?.unit && (
                    <span className="font-normal text-gray-700 text-sm">
                      {' '}
                      ({product.inventory.amount_per_unit}{' '}
                      {product.inventory.unit})
                    </span>
                  )}
                </CardTitle>
                <p className="text-lg font-bold text-gray-900 mt-1 py-1 rounded">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                  }).format(product.price || 0)}
                </p>
              </CardContent>
            </Card>
          ))}

          {products.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No products available yet</p>
              <p className="text-sm">Check back later for new products</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
