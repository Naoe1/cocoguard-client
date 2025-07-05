import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  ShoppingCart,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { useProduct } from '@/features/store/api/GetProduct';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '@/shared/components/ui/input';
import { toast } from 'sonner';
import { useCart } from '@/features/store/context/CartContext';

export const ProductView = ({ productId, farmId }) => {
  const productQuery = useProduct({ productId, farmId });
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (product && value > product.amount_to_sell) {
      value = product.amount_to_sell;
      toast.info(`Maximum available quantity is ${product.amount_to_sell}`);
    }
    setQuantity(value);
  };

  if (productQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (productQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <p className="text-lg">Error loading product</p>
        <Button variant="outline" onClick={handleGoBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const product = productQuery.data?.data;

  return (
    <div className="container mx-auto px-4 md:px-20 py-8">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-8">
        <Card className="border-0 shadow-none overflow-hidden">
          <CardHeader className="p-0 relative h-[400px] overflow-hidden bg-gray-50 rounded-lg">
            {product?.image ? (
              <img
                src={product.image}
                alt={product.inventory?.name || 'Product image'}
                className="h-full w-full object-contain"
                onError={(e) => {
                  const placeholder =
                    e.currentTarget.parentElement?.querySelector(
                      '.image-placeholder',
                    );
                  if (placeholder) placeholder.style.display = 'flex';
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="image-placeholder absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-300">
                <ImageIcon size={80} />
              </div>
            )}
          </CardHeader>
        </Card>

        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {product?.inventory?.name || 'Product'}
            {product?.inventory?.unit &&
              ` (${product.inventory.amount_per_unit} ${product.inventory.unit})`}
          </h1>

          <div className="mt-4 text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'PHP',
            }).format(product?.price || 0)}
          </div>

          {product?.amount_to_sell > 0 ? (
            <Badge className="w-fit mt-2 bg-green-100 text-green-800 hover:bg-green-100 border-0">
              In Stock: {product.amount_to_sell} available
            </Badge>
          ) : (
            <Badge className="w-fit mt-2 bg-red-100 text-red-800 hover:bg-red-100 border-0">
              Out of Stock
            </Badge>
          )}

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm text-gray-500 mb-1"
              >
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={product?.amount_to_sell > 0 ? product.amount_to_sell : 1}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-28 text-center"
                disabled={
                  !product?.amount_to_sell || product.amount_to_sell === 0
                }
              />
            </div>

            <div className="space-y-3 pt-2">
              <Button
                size="lg"
                className="w-full h-12 text-base"
                disabled={
                  !product?.amount_to_sell ||
                  product.amount_to_sell === 0 ||
                  quantity < 1
                }
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="w-full h-12 text-base bg-amber-600 hover:bg-amber-700 text-white"
                disabled={!product?.amount_to_sell}
                onClick={() => {
                  toast.success(
                    `Processing immediate purchase for ${quantity} item(s)`,
                  );
                  // Future implementation for direct checkout
                }}
              >
                Buy It Now
              </Button>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-medium mb-3">Description</h2>
            <p className="text-gray-600">
              {product?.description ||
                'No description available for this product.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
