import { configureStore } from '@reduxjs/toolkit';
import { ticketsApi } from '@/features/tickets/ticketsApi';
import { dashboardApi } from '@/features/dashboard/dashboardApi';
import authReducer from '@/features/auth/authSlice';
import settingsReducer from '@/features/settings/settingsSlice';
import { authApi } from '@/features/auth/authApi';
import { subscribeAuthPersistence } from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    [ticketsApi.reducerPath]: ticketsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault()
      .concat(ticketsApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(authApi.middleware),
});

// Persist auth state to localStorage on every change
subscribeAuthPersistence(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
