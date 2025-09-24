import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, render, screen } from '@testing-library/react';
import {
  AuthProvider,
  useAuth,
  ProtectedRoute,
  DenyStaffAccess,
  AuthContext,
} from '@/lib/auth';
import { api } from '@/lib/apiClient';
import { queryClient } from '@/lib/reactQuery';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const setup = () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
  });
  return result;
};

describe('AuthProvider', () => {
  let postSpy;
  let getSpy;

  beforeEach(() => {
    postSpy = vi.spyOn(api, 'post');
    getSpy = vi.spyOn(api, 'get');
  });

  afterEach(() => {
    postSpy.mockRestore();
    getSpy.mockRestore();
    queryClient.clear();
  });

  it('initially provides null user and token', () => {
    const result = setup();
    expect(result.current.auth).toEqual({ user: null, token: null });
  });

  it('login sets user and token', async () => {
    const user = { id: 1, email: 'a@b.com' };
    postSpy.mockResolvedValueOnce({ data: { user, access_token: 'TOKEN123' } });

    const result = setup();

    await act(async () => {
      await result.current.login({ email: 'a@b.com', password: 'pass' });
    });

    expect(postSpy).toHaveBeenCalledWith('/auth/login', {
      email: 'a@b.com',
      password: 'pass',
    });
    expect(result.current.auth.user).toEqual(user);
    expect(result.current.auth.token).toBe('TOKEN123');
  });

  it('logout clears user and token and clears react-query cache', async () => {
    const user = { id: 2, email: 'c@d.com' };
    postSpy
      .mockResolvedValueOnce({ data: { user, access_token: 'T' } })
      .mockResolvedValueOnce({ status: 200 });

    const clearSpy = vi.spyOn(queryClient, 'clear');

    const result = setup();

    await act(async () => {
      await result.current.login({ email: 'c@d.com', password: 'pw' });
    });

    expect(result.current.auth.user).toEqual(user);

    await act(async () => {
      await result.current.logout();
    });

    expect(postSpy).toHaveBeenLastCalledWith('/auth/logout');
    expect(result.current.auth).toEqual({ user: null, token: null });
    expect(clearSpy).toHaveBeenCalled();

    clearSpy.mockRestore();
  });

  it('register success sets user & token', async () => {
    const user = { id: 2, email: 'new@user.com' };
    postSpy.mockResolvedValueOnce({ data: { user, access_token: 'RTOKEN' } });
    const result = setup();
    await act(async () => {
      await result.current.register({ email: 'new@user.com', password: 'pw' });
    });
    expect(postSpy).toHaveBeenCalledWith('/auth/register', {
      email: 'new@user.com',
      password: 'pw',
    });
    expect(result.current.auth.user).toEqual(user);
    expect(result.current.auth.token).toBe('RTOKEN');
  });

  it('refresh success returns data without altering existing user', async () => {
    const result = setup();
    act(() => {
      result.current.setAuth({ user: { id: 77 }, token: 'OLD' });
    });
    getSpy.mockResolvedValueOnce({ data: { access_token: 'NEW' } });
    const data = await result.current.refresh();
    expect(getSpy).toHaveBeenCalledWith('/auth/refresh');
    expect(data).toEqual({ access_token: 'NEW' });
    // refresh() code does not set token on success (only returns data), so state should remain
    expect(result.current.auth.token).toBe('OLD');
  });

  it('fetchMe success sets user', async () => {
    const me = { id: 55, email: 'me@x.com' };
    getSpy.mockResolvedValueOnce({ data: me });

    const result = setup();

    await act(async () => {
      const data = await result.current.fetchMe();
      expect(data).toEqual(me);
    });
    expect(getSpy).toHaveBeenCalledWith('/auth/me');
    expect(result.current.auth.user).toEqual(me);
  });
  it('forgotPassword success returns data', async () => {
    postSpy.mockResolvedValueOnce({ data: { message: 'Email sent' } });
    const result = setup();
    const resp = await result.current.forgotPassword({ email: 'user@x.com' });
    expect(postSpy).toHaveBeenCalledWith('/auth/forgot', {
      email: 'user@x.com',
    });
    expect(resp).toEqual({ message: 'Email sent' });
  });
  it('updatePassword success returns data', async () => {
    postSpy.mockResolvedValueOnce({ data: { ok: true } });
    const result = setup();
    const data = await result.current.updatePassword(
      { password: 'newp' },
      'RESET',
    );
    expect(postSpy).toHaveBeenCalledWith('/auth/update-password?token=RESET', {
      password: 'newp',
    });
    expect(data).toEqual({ ok: true });
  });
});
const Dummy = ({ label }) => <div>{label}</div>;

describe('ProtectedRoute', () => {
  const renderWith = (authValue, initial = ['/app/private']) =>
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={initial}>
          <Routes>
            <Route
              path="/app/private"
              element={
                <ProtectedRoute>
                  <Dummy label="Private Content" />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/login" element={<Dummy label="Login Page" />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

  it('redirects to /auth/login when user is null', () => {
    renderWith({ auth: { user: null } });
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
    expect(screen.queryByText(/private content/i)).not.toBeInTheDocument();
  });

  it('renders children when user exists', () => {
    renderWith({ auth: { user: { id: 1 } } });
    expect(screen.getByText(/private content/i)).toBeInTheDocument();
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument();
  });
});

describe('DenyStaffAccess', () => {
  const renderWith = (authValue, initial = ['/auth/special']) =>
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={initial}>
          <Routes>
            <Route
              path="/auth/special"
              element={
                <DenyStaffAccess>
                  <Dummy label="Special Auth Page" />
                </DenyStaffAccess>
              }
            />
            <Route path="/app" element={<Dummy label="App Dashboard" />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

  it('redirects STAFF user to /app', () => {
    renderWith({ auth: { user: { id: 5, role: 'STAFF' } } });
    expect(screen.getByText(/app dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/special auth page/i)).not.toBeInTheDocument();
  });

  it('allows non-staff user to view page', () => {
    renderWith({ auth: { user: { id: 7, role: 'ADMIN' } } });
    expect(screen.getByText(/special auth page/i)).toBeInTheDocument();
    expect(screen.queryByText(/app dashboard/i)).not.toBeInTheDocument();
  });
});
