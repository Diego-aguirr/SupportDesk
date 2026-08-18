import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types';

const STORAGE_KEY = 'supportdesk-auth';

function loadInitialState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthState;
      if (parsed.user && parsed.token && parsed.isAuthenticated) {
        return parsed;
      }
    }
  } catch {
    // corrupted storage — fall back to defaults
  }
  return { user: null, token: null, isAuthenticated: false };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
