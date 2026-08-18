import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { setCredentials, logout } from '@/features/auth/authSlice';
import { setTheme, toggleShortcut, resetShortcuts } from '@/features/settings/settingsSlice';
import type { Theme } from '@/types';

// ─── Auth Persistence ──────────────────────────────────────────────────

const AUTH_KEY = 'supportdesk-auth';

function persistAuth(state: RootState['auth']) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
  } catch {}
}

// ─── Settings Persistence ──────────────────────────────────────────────

const SETTINGS_KEY = 'supportdesk-settings';

function persistSettings(state: RootState['settings']) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
  } catch {}
}

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove('light', 'dark');

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    html.classList.add(theme);
  }
}

// ─── Listener Middleware ────────────────────────────────────────────────

export const listenerMiddleware = createListenerMiddleware();

// Auth changes → persist to localStorage
listenerMiddleware.startListening({
  matcher: isAnyOf(setCredentials, logout),
  effect: async (_action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    const state = listenerApi.getState() as RootState;
    persistAuth(state.auth);
  },
});

// Settings changes → persist to localStorage + apply theme
listenerMiddleware.startListening({
  matcher: isAnyOf(setTheme, toggleShortcut, resetShortcuts),
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    const state = listenerApi.getState() as RootState;
    persistSettings(state.settings);
    if (setTheme.match(action)) {
      applyTheme(action.payload);
    }
  },
});

// Apply theme on module load (startup)
const raw = localStorage.getItem(SETTINGS_KEY);
if (raw) {
  try {
    const parsed = JSON.parse(raw);
    if (parsed.theme) applyTheme(parsed.theme);
  } catch {}
}
