import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/reactQuery';
import { ErrorBoundary } from 'react-error-boundary';
import MainErrorFallback from '@/components/errors/Main';
import { AuthProvider } from '@/lib/auth';

export const AppProvider = ({ children }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<MainErrorFallback />}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {import.meta.env.DEV && <ReactQueryDevtools />}
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
