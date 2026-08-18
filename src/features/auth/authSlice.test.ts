import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, { setCredentials, logout } from './authSlice';
import type { AuthState } from '@/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin' as const,
  avatar: 'https://example.com/avatar.png',
};

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('setCredentials sets user, token, and isAuthenticated', () => {
    const action = setCredentials({ user: mockUser, token: 'abc123' });
    const state = authReducer(initialState, action);

    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('abc123');
    expect(state.isAuthenticated).toBe(true);
  });

  it('logout clears everything', () => {
    const loggedIn = authReducer(initialState, setCredentials({ user: mockUser, token: 'abc123' }));
    const state = authReducer(loggedIn, logout());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
