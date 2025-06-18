import { LoginForm } from '@/features/auth/LoginForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export const LoginRoute = () => {
  return (
    <AuthLayout
      title="Sign in to your account"
      description="Welcome back! Please enter your details"
    >
      <LoginForm />
    </AuthLayout>
  );
};
