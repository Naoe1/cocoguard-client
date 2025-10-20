import { useSearchParams } from 'react-router-dom';
import { WelcomeForm } from '@/features/auth/Welcome';

export const WelcomeRoute = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('access_token');
  if (!token) {
    // return (window.location.href = '/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Before you get started
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your a password below to secure your account.
          </p>
        </div>
        <WelcomeForm token={token} />
      </div>
    </div>
  );
};
