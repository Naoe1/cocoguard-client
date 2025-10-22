import { useSearchParams } from 'react-router-dom';
import { Confirm } from '@/features/auth/Confirm';

export const ConfirmRoute = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (window.location.href = '/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Cocoguard!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            To complete your registration, please confirm your paypal email
            address.
          </p>
        </div>
        <Confirm token={token} />
      </div>
    </div>
  );
};
