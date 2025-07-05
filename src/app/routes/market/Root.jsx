import { Outlet, Link, useParams } from 'react-router-dom';
import { Suspense } from 'react';
import { Toaster } from '@/shared/components/ui/sonner';
import { Button } from '@/shared/components/ui/button';
import { Home, ShoppingCart } from 'lucide-react';
import { CartProvider, useCart } from '@/features/store/context/CartContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const NavbarContent = () => {
  const { cartCount } = useCart();
  const params = useParams();
  const marketBaseUrl = `/market/${params.marketId}`;

  return (
    <nav className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-gray-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to={marketBaseUrl}
          className="text-2xl font-bold flex items-center"
        >
          <span className="mr-2">🥥</span> CocoGuard Market
        </Link>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Home"
            className="text-gray-50 hover:bg-emerald-800/50"
            asChild
          >
            <Link to={marketBaseUrl}>
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-gray-50 text-gray-900 hover:bg-gray-100"
            asChild
          >
            <Link to={`${marketBaseUrl}/cart`}>
              <ShoppingCart className="h-4 w-4" />
              <span>Cart ({cartCount})</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

const initialOptions = {
  clientId:
    'AT8vS8ZViK4VuyyZyTScCICsCDZbVYIOsnuaZzE-lWDTlZXDm7iIJaidvPPo_uXtR_4p-T1WBbo580Ez',
  currency: 'PHP',
  intent: 'capture',
};

export const MarketRoot = () => {
  return (
    <CartProvider>
      <PayPalScriptProvider options={initialOptions}>
        <Suspense
          fallback={
            <div className="flex size-full items-center justify-center">
              Loading Market...
            </div>
          }
        >
          <div className="min-h-screen bg-emerald-50/30 flex flex-col">
            <NavbarContent />
            <main className="container mx-auto px-4 py-6 flex-grow">
              <Outlet />
            </main>
            <footer className="mt-auto bg-emerald-900 text-gray-50 py-6">
              <div className="container mx-auto px-4 text-center">
                <p>
                  © {new Date().getFullYear()} CocoGuard Market - Premium
                  Coconut Products
                </p>
              </div>
            </footer>
          </div>
          <Toaster richColors theme="light" position="bottom-right" />
        </Suspense>
      </PayPalScriptProvider>
    </CartProvider>
  );
};
