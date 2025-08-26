import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-medium mb-2">Page Not Found</h2>
        <p className="text-muted-foreground">
          Sorry, the page you are looking for does not exist.
        </p>
      </div>

      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
