import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SettingsState, Theme, KeyboardShortcut } from '@/types';

const STORAGE_KEY = 'supportdesk-settings';

const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  { id: 'search', label: 'Focus Search', keys: ['Ctrl', 'K'], action: 'search', enabled: true },
  { id: 'new-ticket', label: 'New Ticket', keys: ['Ctrl', 'N'], action: 'newTicket', enabled: true },
  { id: 'close', label: 'Close Modal', keys: ['Escape'], action: 'close', enabled: true },
  { id: 'prev', label: 'Previous Item', keys: ['K'], action: 'prev', enabled: true },
  { id: 'next', label: 'Next Item', keys: ['J'], action: 'next', enabled: true },
];

function loadInitialState(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SettingsState;
      return {
        theme: parsed.theme ?? 'system',
        shortcuts: parsed.shortcuts?.length ? parsed.shortcuts : DEFAULT_SHORTCUTS,
      };
    }
  } catch {}
  return { theme: 'system', shortcuts: DEFAULT_SHORTCUTS };
}

function persist(state: SettingsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: loadInitialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      persist(state);
      applyTheme(action.payload);
    },
    toggleShortcut(state, action: PayloadAction<string>) {
      const shortcut = state.shortcuts.find((s) => s.id === action.payload);
      if (shortcut) shortcut.enabled = !shortcut.enabled;
      persist(state);
    },
    resetShortcuts(state) {
      state.shortcuts = DEFAULT_SHORTCUTS;
      persist(state);
    },
  },
});

export function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove('light', 'dark');

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    html.classList.add(theme);
  }
}

// Apply theme on load
applyTheme(loadInitialState().theme);

export const { setTheme, toggleShortcut, resetShortcuts } = settingsSlice.actions;
export default settingsSlice.reducer;
