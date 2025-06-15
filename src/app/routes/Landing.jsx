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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/ui/sheet';
import {
  TreePalm,
  BarChart,
  Settings,
  ShieldCheck,
  Menu,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-emerald-100 to-teal-200">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <TreePalm className="h-7 w-7 md:h-8 md:w-8 text-green-600" />{' '}
              {/* Slightly smaller on mobile */}
              <span className="text-xl md:text-2xl font-bold text-gray-800">
                CocoGuard
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/app">Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/register">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navigate through the CocoGuard application sections.
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="grid gap-2">
                    <SheetClose asChild>
                      <Link
                        to="/app"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/auth/login"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/auth/register"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
                      >
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </Link>
                    </SheetClose>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 md:py-36 text-center bg-gradient-to-b from-transparent via-emerald-50/50 to-emerald-100/70">
          <div className="container mx-auto px-4">
            <TreePalm className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Manage Your Coconut Farm Intelligently
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
              CocoGuard provides the tools you need for efficient tracking,
              analysis, and management of your coconut plantation. Boost yield
              and simplify operations.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link to="/auth/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/app">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
              Why Choose CocoGuard?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-green-100 rounded-full p-3 w-fit mb-4">
                    <BarChart className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    Data-Driven Insights
                  </CardTitle>
                  <CardDescription>
                    Track yield, monitor tree health, and analyze trends to make
                    informed decisions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Visualize your farm's performance with intuitive charts and
                    reports.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-blue-100 rounded-full p-3 w-fit mb-4">
                    <Settings className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    Simplified Management
                  </CardTitle>
                  <CardDescription>
                    Streamline tasks like harvest logging, pest control, and
                    resource allocation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Manage your entire plantation from one easy-to-use
                    dashboard.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-teal-100 rounded-full p-3 w-fit mb-4">
                    <ShieldCheck className="h-8 w-8 text-teal-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    Secure & Reliable
                  </CardTitle>
                  <CardDescription>
                    Your farm data is kept safe and accessible whenever you need
                    it.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Built with modern technology for robust performance and
                    security.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-teal-100 to-teal-200">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Ready to Optimize Your Farm?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Start your free trial today and experience the future of coconut
              farm management. No credit card required.
            </p>
            <Button size="lg" asChild>
              <Link to="/auth/register">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <TreePalm className="h-6 w-6 text-green-500" />
            <span className="text-lg font-semibold text-white">CocoGuard</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} CocoGuard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
