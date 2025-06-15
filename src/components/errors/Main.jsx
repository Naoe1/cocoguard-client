import React from 'react';
import { Button } from '@/shared/components/ui/button';

const MainErrorFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium mb-2">Something went wrong</h2>
      </div>

      <Button onClick={() => window.location.assign(window.location.origin)}>
        Go Home
      </Button>
    </div>
  );
};

export default MainErrorFallback;
