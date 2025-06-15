import React from 'react';
export const AuthLayout = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-3">
            <img className="h-12 w-auto" src="/logo.svg" alt="CocoGuard Logo" />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg border border-gray-200/50 sm:rounded-xl sm:px-10">
            {children}
          </div>
        </div>
      </div>
      <footer className="py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CocoGuard. All rights reserved.
      </footer>
    </div>
  );
};
