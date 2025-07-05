import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/shared/components/ui/card';
import { Trash2, ShoppingCart, ArrowLeft, ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PaypalPayment } from '@/lib/PaypalPayment';
import { useParams } from 'react-router-dom';

export const CartView = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  } = useCart();
  const navigate = useNavigate();
  const params = useParams();
  const farmId = params.marketId;

  const handleQuantityChange = (productId, currentStock, newQuantityStr) => {
    let newQuantity = parseInt(newQuantityStr);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    } else if (newQuantity > currentStock) {
      newQuantity = currentStock;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shopping
      </Button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <Card className="text-center py-12 bg-gray-50 border-dashed">
          <CardHeader>
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <CardTitle className="text-xl text-gray-600">
              Your cart is empty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Looks like you haven't added anything yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ product, quantity }) => (
              <Card
                key={product.id}
                className="flex flex-col items-center sm:flex-row sm:items-center p-4 gap-4 shadow-sm"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.inventory?.name || 'Product image'}
                    className="w-40 h-40 object-cover rounded-md border bg-gray-100 flex-shrink-0"
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
                  <div
                    className={`w-50 h-40 bg-gray-50 flex items-center justify-center text-gray-300 ${
                      product.image ? 'hidden' : 'flex'
                    }`}
                    style={!product.image ? { display: 'flex' } : {}}
                  >
                    <ImageIcon size={40} />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row flex-grow items-center justify-between gap-4 w-full">
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-800 text-2xl">
                      {product.inventory?.name || 'Product'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {product.inventory?.unit
                        ? `${product.inventory.amount_per_unit} ${product.inventory.unit}`
                        : 'Standard Unit'}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    Item Total: {formatCurrency(product.price * quantity)}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Input
                      type="number"
                      min="1"
                      max={product.amount_to_sell}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          product.id,
                          product.amount_to_sell,
                          e.target.value,
                        )
                      }
                      className="w-25 text-center h-9"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-100"
                      onClick={() => removeFromCart(product.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            <Button
              variant="outline"
              className="text-red-600 border-red-500 hover:bg-red-50"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-md">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <PaypalPayment
                  cartItems={cartItems}
                  farmId={farmId}
                  clearCart={clearCart}
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
