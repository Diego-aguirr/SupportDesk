import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  avgResolutionTime: string;
  byPriority: { priority: string; count: number }[];
  byStatus: { status: string; count: number }[];
  trend: { date: string; count: number }[];
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  tagTypes: ['Stats'],
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Stats'],
    }),
  }),
});

export const { useGetStatsQuery } = dashboardApi;
