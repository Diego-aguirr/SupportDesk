import { http, HttpResponse } from 'msw';
import type { SettingsState, KeyboardShortcut } from '@/types';
import { delay, shouldError } from '../helpers';

const defaultShortcuts: KeyboardShortcut[] = [
  { id: 'search', label: 'Global Search', keys: ['/', 'Ctrl+K'], action: 'openSearch', enabled: true },
  { id: 'newTicket', label: 'New Ticket', keys: ['Ctrl+N'], action: 'createTicket', enabled: true },
  { id: 'help', label: 'Keyboard Shortcuts', keys: ['?'], action: 'showShortcuts', enabled: true },
  { id: 'closeModal', label: 'Close Modal', keys: ['Escape'], action: 'closeModal', enabled: true },
  { id: 'save', label: 'Save', keys: ['Ctrl+S'], action: 'save', enabled: true },
];

let currentSettings: SettingsState = {
  theme: 'system',
  shortcuts: defaultShortcuts,
};

export const settingsHandlers = [
  http.get('/api/v1/settings', async () => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    return HttpResponse.json(currentSettings);
  }),

  http.put('/api/v1/settings', async ({ request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as Partial<SettingsState>;
    currentSettings = { ...currentSettings, ...body };
    return HttpResponse.json(currentSettings);
  }),
];
