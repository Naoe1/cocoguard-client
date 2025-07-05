import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

import { TreePalm, ShoppingCart, Package, Leaf } from 'lucide-react';

export const MarketLanding = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 via-amber-100 to-orange-200">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/market" className="flex items-center space-x-2">
              <TreePalm className="h-7 w-7 md:h-8 md:w-8 text-green-600" />{' '}
              <span className="text-xl md:text-2xl font-bold text-gray-800">
                CocoGuard Market
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/market/products">Products</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/market/cart">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Cart
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="py-24 md:py-36 text-center bg-gradient-to-b from-transparent via-amber-50/50 to-amber-100/70">
          <div className="container mx-auto px-4">
            <TreePalm className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Fresh Coconuts Delivered to Your Door
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
              Experience the taste of the tropics with premium coconuts sourced
              directly from our managed farms. Order online for ultimate
              convenience.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link to="/market/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
              Why Shop at CocoGuard Market?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-green-100 rounded-full p-3 w-fit mb-4">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    Farm Fresh Quality
                  </CardTitle>
                  <CardDescription>
                    Get the freshest coconuts, harvested with care from
                    sustainably managed farms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Directly sourced for maximum freshness and taste.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-blue-100 rounded-full p-3 w-fit mb-4">
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    Easy Online Ordering
                  </CardTitle>
                  <CardDescription>
                    Browse our selection and place your order in just a few
                    clicks. Simple and secure checkout.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Convenient shopping experience from anywhere.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-orange-100 rounded-full p-3 w-fit mb-4">
                    <Package className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    Reliable Delivery
                  </CardTitle>
                  <CardDescription>
                    Enjoy fast and dependable delivery, bringing the taste of
                    fresh coconuts right to you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Carefully packaged to ensure quality upon arrival.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-orange-100 to-orange-200">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Ready for Fresh Coconuts?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Explore our range of high-quality coconut products and place your
              order today.
            </p>
            <Button size="lg" asChild>
              <Link to="/market/products">Browse Products</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <TreePalm className="h-6 w-6 text-green-500" />
            <span className="text-lg font-semibold text-white">
              CocoGuard Market
            </span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} CocoGuard Market. All rights
            reserved.
          </p>
          <div className="mt-2 text-xs">
            <Link to="/" className="hover:text-white underline">
              Back to CocoGuard Farm Management
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
