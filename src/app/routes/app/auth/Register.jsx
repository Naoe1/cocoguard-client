import { RegisterForm } from '@/features/auth/RegisterForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export const RegisterRoute = () => {
  return (
    <AuthLayout
      title="Create an account"
      description="Get started by entering your information"
    >
      <RegisterForm />
    </AuthLayout>
  );
};
