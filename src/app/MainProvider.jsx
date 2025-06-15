import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/reactQuery';
import { ErrorBoundary } from 'react-error-boundary';
import MainErrorFallback from '@/components/errors/Main';

export const AppProvider = ({ children }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<MainErrorFallback />}>
        <QueryClientProvider client={queryClient}>
          {import.meta.env.DEV && <ReactQueryDevtools />}
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
