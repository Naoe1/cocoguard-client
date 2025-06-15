import { createContext, useState, useContext, useLayoutEffect } from 'react';
import { api } from './apiClient';
import z from 'zod';
import { Navigate, useLocation } from 'react-router-dom';
import { queryClient } from './reactQuery';

export const registerInputSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email().min(1, 'Required'),
  password: z.string().min(6, 'Minimum 6 characters'),
  street: z.string().min(1, 'Street address is required'),
  barangay: z.string().min(1, 'Barangay is required'),
  city: z.string().min(1, 'City/Municipality is required'),
  province: z.string().min(1, 'Province is required'),
  region: z.string().min(1, 'Region is required'),
  postal_code: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^\d+$/, 'Postal code must contain only digits'),
});

export const loginInputSchema = z.object({
  email: z.string().email().min(1, 'Required'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

const AuthContext = createContext();

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
      setAuth({ user: response.data.user, token: response.data.access_token });
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
