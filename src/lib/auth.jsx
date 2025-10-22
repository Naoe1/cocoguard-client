import { createContext, useState, useContext, useLayoutEffect } from 'react';
import { api } from './apiClient';
import z from 'zod';
import { Navigate, useLocation } from 'react-router-dom';
import { queryClient } from './reactQuery';

export const registerInputSchema = z.object({
  firstName: z.string().min(1, 'Required').max(40, 'First name too long'),
  lastName: z.string().min(1, 'Required').max(40, 'Last name too long'),
  email: z.string().min(1, 'Required').email().max(50, 'Email too long'),
  password: z.string().min(8, 'Minimum 8 characters'),
  street: z
    .string()
    .min(1, 'Street address is required')
    .max(100, 'Street address too long'),
  barangay: z
    .string()
    .min(1, 'Barangay is required')
    .max(30, 'Barangay too long'),
  city: z
    .string()
    .min(1, 'City/Municipality is required')
    .max(30, 'City/Municipality too long'),
  province: z
    .string()
    .min(1, 'Province is required')
    .max(30, 'Province too long'),
  region: z.string().min(1, 'Region is required').max(30, 'Region too long'),
  postal_code: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^\d+$/, 'Postal code must contain only digits')
    .length(4, 'Postal code must be exactly 4 digits'),
});

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email().max(30, 'Too long'),
  password: z.string().min(1, 'Please enter your password'),
});

export const forgotPasswordInputSchema = z.object({
  email: z
    .string()
    .min(1, 'Required')
    .email({ message: 'Invalid email address' }),
});

export const updatePasswordInputSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
  });

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      setAuth({ user: response.data.user, token: response.data.access_token });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (input) => {
    try {
      const response = await api.post('/auth/register', input);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await api.post('/auth/logout');
      if (response.status === 200) {
        setAuth({ user: null, token: null });
        queryClient.clear();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const refresh = async () => {
    try {
      const response = await api.get('/auth/refresh');
      return response.data;
    } catch (error) {
      setAuth((prev) => {
        return { ...prev, token: null };
      });
      throw error;
    }
  };

  const fetchMe = async () => {
    try {
      const response = await api.get('/auth/me');
      setAuth((prev) => {
        return { ...prev, user: response.data };
      });
      return response.data;
    } catch (error) {
      setAuth((prev) => {
        return { ...prev, user: null };
      });
      throw error;
    }
  };

  const forgotPassword = async (data) => {
    try {
      const response = await api.post('/auth/forgot', data);
      console.log('Forgot password response:', data);
      return response.data;
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      throw error;
    }
  };

  const updatePassword = async (data, token) => {
    try {
      const response = await api.post(
        '/auth/update-password?token=' + token,
        data,
      );
      console.log('Forgot password response:', data);
      return response.data;
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      throw error;
    }
  };

  const welcomeStaff = async (data, token) => {
    try {
      const response = await api.post('/auth/welcome?token=' + token, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const confirmEmail = async (data, token) => {
    try {
      console.log(token);
      const response = await api.post('/auth/confirm?token=' + token, data);
      return response.data;
    } catch (error) {
      console.error('Error in confirmEmail:', error);
      throw error;
    }
  };

  useLayoutEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
    return () => {
      api.interceptors.request.eject(requestIntercept);
    };
  }, [auth?.token]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        login,
        register,
        logout,
        refresh,
        fetchMe,
        forgotPassword,
        updatePassword,
        welcomeStaff,
        confirmEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();
  if (!auth.user) {
    return <Navigate to={`/auth/login`} state={{ from: location }} replace />;
  }
  return children;
};

export const DenyStaffAccess = ({ children }) => {
  const { auth } = useAuth();

  if (auth?.user?.role === 'STAFF') {
    return <Navigate to="/app" replace />;
  }

  return children;
};
