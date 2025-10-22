import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider, useAuth } from '@/lib/auth';
import { api } from '@/lib/apiClient';
import { LoginRoute as Login } from '../Login.jsx';
import { RegisterRoute } from '../Register.jsx';
import { ForgotRoute } from '../Forgot.jsx';
import { UpdatePasswordRoute } from '../UpdatePassword.jsx';

const AppDashboard = () => <div>App Dashboard</div>;
describe('Auth Integration Test', () => {
  describe('Login Integration Test', () => {
    it('should allow a user with an existing account to log in and be redirected', async () => {
      const mockLogin = vi.fn().mockResolvedValue({
        data: {
          user: { id: 1, email: 'test@example.com', role: 'USER' },
        },
      });

      render(
        <AuthContext.Provider
          value={{ login: mockLogin, auth: { user: null } }}
        >
          <MemoryRouter initialEntries={['/auth/login']}>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/app" element={<AppDashboard />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');

      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(await screen.findByText('App Dashboard')).toBeInTheDocument();
    });

    it('should show an error message on failed login', async () => {
      const mockLogin = vi
        .fn()
        .mockRejectedValue(new Error('Invalid credentials'));

      render(
        <AuthContext.Provider
          value={{ login: mockLogin, auth: { user: null } }}
        >
          <MemoryRouter initialEntries={['/auth/login']}>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/app" element={<AppDashboard />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      await userEvent.type(
        screen.getByLabelText(/email/i),
        'nonexistent@user.com',
      );
      await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');

      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockLogin).toHaveBeenCalledWith({
        email: 'nonexistent@user.com',
        password: 'wrongpassword',
      });

      expect(
        await screen.findByText(
          /Failed to sign in. Please check your credentials/i,
        ),
      ).toBeInTheDocument();

      expect(screen.queryByText('App Dashboard')).not.toBeInTheDocument();
    });

    it('disables submit and shows loading text while logging in', async () => {
      let resolveLogin;
      const mockLogin = vi.fn().mockReturnValue(
        new Promise((res) => {
          resolveLogin = res;
        }),
      );

      render(
        <AuthContext.Provider
          value={{ login: mockLogin, auth: { user: null } }}
        >
          <MemoryRouter initialEntries={['/auth/login']}>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/app" element={<AppDashboard />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');

      const button = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(button);

      expect(button).toBeDisabled();
      expect(button).toHaveTextContent(/signing in\.{3}|signing in/i);

      resolveLogin({ data: { user: { id: 1 } } });

      expect(await screen.findByText('App Dashboard')).toBeInTheDocument();
    });

    it('does not submit when form is invalid', async () => {
      const mockLogin = vi.fn();

      render(
        <AuthContext.Provider
          value={{ login: mockLogin, auth: { user: null } }}
        >
          <MemoryRouter initialEntries={['/auth/login']}>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockLogin).not.toHaveBeenCalled();

      expect(await screen.findByText(/required/i)).toBeInTheDocument();
    });

    it('updates AuthContext with user after successful login', async () => {
      const ShowUser = () => {
        const { auth } = useAuth();
        return (
          <div>
            <div>App Dashboard</div>
            <div data-testid="user-email">{auth.user?.email ?? 'none'}</div>
          </div>
        );
      };

      const user = { id: 42, email: 'test@example.com', role: 'ADMIN' };
      const postSpy = vi.spyOn(api, 'post').mockImplementation((url, body) => {
        if (url === '/auth/login') {
          return Promise.resolve({ data: { user, access_token: 'token-123' } });
        }
        return Promise.reject(new Error('Unexpected API call: ' + url));
      });

      try {
        render(
          <AuthProvider>
            <MemoryRouter initialEntries={['/auth/login']}>
              <Routes>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/app" element={<ShowUser />} />
              </Routes>
            </MemoryRouter>
          </AuthProvider>,
        );

        await userEvent.type(
          screen.getByLabelText(/email/i),
          'test@example.com',
        );
        await userEvent.type(screen.getByLabelText(/password/i), 'password123');

        await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

        expect(await screen.findByText('App Dashboard')).toBeInTheDocument();
        expect(screen.getByTestId('user-email')).toHaveTextContent(
          'test@example.com',
        );

        expect(postSpy).toHaveBeenCalledWith('/auth/login', {
          email: 'test@example.com',
          password: 'password123',
        });
      } finally {
        postSpy.mockRestore();
      }
    });
  });
  describe('Register Integration Test', () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();

    it('shows validation errors and does not submit when form is invalid', async () => {
      const mockRegister = vi.fn();

      render(
        <AuthContext.Provider
          value={{ register: mockRegister, auth: { user: null } }}
        >
          <MemoryRouter initialEntries={['/auth/register']}>
            <Routes>
              <Route path="/auth/register" element={<RegisterRoute />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

      expect(mockRegister).not.toHaveBeenCalled();
      expect(await screen.findAllByText(/required/i)).toHaveLength(9);
    });
  });

  describe('Forgot Password Integration Test', () => {
    it('submits a valid email and show confirmation', async () => {
      const mockForgot = vi.fn().mockResolvedValue({ message: 'Email sent' });

      render(
        <AuthContext.Provider
          value={{ forgotPassword: mockForgot, auth: { user: null } }}
        >
          <MemoryRouter initialEntries={['/auth/forgot']}>
            <Routes>
              <Route path="/auth/forgot" element={<ForgotRoute />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'user@gmail.com');

      const btn = screen.getByRole('button', { name: /send reset link/i });
      await userEvent.click(btn);

      expect(mockForgot).toHaveBeenCalledWith({
        email: 'user@gmail.com',
      });

      expect(
        await screen.findByText(
          /Password reset link has been successfully sent/i,
        ),
      ).toBeInTheDocument();
    });

    it('does not call forgotPassword on invalid or empty email', async () => {
      const mockForgot = vi.fn();
      render(
        <AuthContext.Provider
          value={{ forgotPassword: mockForgot, auth: { user: null } }}
        >
          <MemoryRouter initialEntries={['/auth/forgot']}>
            <Routes>
              <Route path="/auth/forgot" element={<ForgotRoute />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      const btn = screen.getByRole('button', { name: /send reset link/i });
      await userEvent.click(btn);
      expect(await screen.findByText(/required/i)).toBeInTheDocument();

      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'not-an-email');

      await userEvent.click(btn);
      expect(
        await screen.findByText(/invalid email address/i),
      ).toBeInTheDocument();
      expect(mockForgot).not.toHaveBeenCalled();
    });

    it('shows an error if email does not exist', async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'User not found' },
        },
      };

      const mockForgot = vi.fn().mockRejectedValue(notFoundError);

      render(
        <AuthContext.Provider
          value={{ forgotPassword: mockForgot, auth: { user: null } }}
        >
          <MemoryRouter initialEntries={['/auth/forgot']}>
            <Routes>
              <Route path="/auth/forgot" element={<ForgotRoute />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      await userEvent.type(
        screen.getByLabelText(/email/i),
        'missing@domain.com',
      );
      await userEvent.click(
        screen.getByRole('button', { name: /send reset link/i }),
      );

      expect(mockForgot).toHaveBeenCalledWith({ email: 'missing@domain.com' });

      expect(await screen.findByText(/user not found/i)).toBeInTheDocument();
    });
  });

  describe('Change Password Integration Test', () => {
    it('updates password successfully shows success message', async () => {
      const token = 'RESET123';
      const mockUpdate = vi.fn().mockResolvedValue({ data: { ok: true } });

      render(
        <AuthContext.Provider
          value={{ updatePassword: mockUpdate, auth: { user: null } }}
        >
          <MemoryRouter
            initialEntries={[`/auth/update-password?access_token=${token}`]}
          >
            <Routes>
              <Route
                path="/auth/update-password"
                element={<UpdatePasswordRoute />}
              />
              <Route path="/auth/login" element={<div>Login Page</div>} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      await userEvent.type(screen.getByLabelText('New Password'), 'secret66');
      await userEvent.type(
        screen.getByLabelText(/confirm new password/i),
        'secret66',
      );

      const btn = screen.getByRole('button', { name: /update password/i });
      await userEvent.click(btn);

      expect(mockUpdate).toHaveBeenCalledWith(
        { password: 'secret66', confirmPassword: 'secret66' },
        token,
      );

      expect(
        await screen.findByText(/your password has been updated successfully/i),
      ).toBeInTheDocument();

      expect(
        screen.getByRole('link', { name: /back to sign in/i }),
      ).toBeInTheDocument();
    });
    it('shows validation errors for short and mismatched passwords', async () => {
      const mockUpdate = vi.fn();
      render(
        <AuthContext.Provider
          value={{ updatePassword: mockUpdate, auth: { user: null } }}
        >
          <MemoryRouter
            initialEntries={['/auth/update-password?access_token=ABC']}
          >
            <Routes>
              <Route
                path="/auth/update-password"
                element={<UpdatePasswordRoute />}
              />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      await userEvent.type(screen.getByLabelText('New Password'), '123442425');
      await userEvent.type(
        screen.getByLabelText(/confirm new password/i),
        '456',
      );
      await userEvent.click(
        screen.getByRole('button', { name: /update password/i }),
      );

      expect(
        await screen.findByText(/at least 8 characters/i),
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/passwords don't match/i),
      ).toBeInTheDocument();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('shows error when access token is invalid or missing', async () => {
      const apiError = {
        response: {
          status: 400,
          data: { message: 'Invalid token' },
        },
      };
      const mockUpdate = vi.fn().mockRejectedValue(apiError);

      render(
        <AuthContext.Provider
          value={{ updatePassword: mockUpdate, auth: { user: null } }}
        >
          <MemoryRouter
            initialEntries={['/auth/update-password?access_token=BADTOKEN']}
          >
            <Routes>
              <Route
                path="/auth/update-password"
                element={<UpdatePasswordRoute />}
              />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      expect(
        screen.getByRole('heading', { name: /update your password/i }),
      ).toBeInTheDocument();

      await userEvent.type(screen.getByLabelText('New Password'), 'secret66');
      await userEvent.type(
        screen.getByLabelText(/confirm new password/i),
        'secret66',
      );
      await userEvent.click(
        screen.getByRole('button', { name: /update password/i }),
      );

      expect(mockUpdate).toHaveBeenCalledWith(
        { password: 'secret66', confirmPassword: 'secret66' },
        'BADTOKEN',
      );

      expect(await screen.findByText(/invalid token/i)).toBeInTheDocument();
    });
  });
});
