import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { ticketHandlers } from './handlers/tickets';
import { dashboardHandlers } from './handlers/dashboard';
import { settingsHandlers } from './handlers/settings';

export const worker = setupWorker(
  ...authHandlers,
  ...ticketHandlers,
  ...dashboardHandlers,
  ...settingsHandlers,
);
