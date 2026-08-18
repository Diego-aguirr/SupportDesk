import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import type { Ticket, Comment, ActivityLogEntry, PaginatedResponse, TicketFilters } from '@/types';

export const ticketsApi = createApi({
  reducerPath: 'ticketsApi',
  tagTypes: ['Ticket', 'TicketList'],
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
    // GET /tickets?page=1&pageSize=20&status=open&priority=high&search=...
    getTickets: builder.query<PaginatedResponse<Ticket>, TicketFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.page) params.set('page', String(filters.page));
        if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
        if (filters.status?.length) filters.status.forEach((s) => params.append('status', s));
        if (filters.priority?.length) filters.priority.forEach((p) => params.append('priority', p));
        if (filters.search) params.set('search', filters.search);
        if (filters.sortBy) params.set('sortBy', filters.sortBy);
        if (filters.sortDir) params.set('sortDir', filters.sortDir);
        return `/tickets?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Ticket' as const, id })),
              { type: 'TicketList', id: 'LIST' },
            ]
          : [{ type: 'TicketList', id: 'LIST' }],
    }),

    // GET /tickets/:id
    getTicket: builder.query<Ticket, number>({
      query: (id) => `/tickets/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Ticket', id }],
    }),

    // POST /tickets
    createTicket: builder.mutation<Ticket, Partial<Ticket>>({
      query: (body) => ({
        url: '/tickets',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TicketList', id: 'LIST' }],
    }),

    // PATCH /tickets/:id
    updateTicket: builder.mutation<Ticket, { id: number; changes: Partial<Ticket> }>({
      query: ({ id, changes }) => ({
        url: `/tickets/${id}`,
        method: 'PATCH',
        body: changes,
      }),
      // Optimistic update: update cache before server responds
      async onQueryStarted({ id, changes }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ticketsApi.util.updateQueryData('getTicket', id, (draft) => {
            Object.assign(draft, changes);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Revert on error
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Ticket', id },
        { type: 'TicketList', id: 'LIST' },
      ],
    }),

    // DELETE /tickets/:id
    deleteTicket: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Ticket', id },
        { type: 'TicketList', id: 'LIST' },
      ],
    }),

    // POST /tickets/:id/comments
    addComment: builder.mutation<Comment, { ticketId: string; content: string }>({
      query: ({ ticketId, content }) => ({
        url: `/tickets/${ticketId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: 'Ticket', id: Number(ticketId) },
      ],
    }),

    // GET /tickets/:id/activity
    getActivity: builder.query<ActivityLogEntry[], number>({
      query: (ticketId) => `/tickets/${ticketId}/activity`,
    }),

    // POST /tickets/bulk/status
    bulkUpdateStatus: builder.mutation<
      { updated: number },
      { ids: number[]; status: string }
    >({
      query: (body) => ({
        url: '/tickets/bulk/status',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TicketList', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useAddCommentMutation,
  useGetActivityQuery,
  useBulkUpdateStatusMutation,
} = ticketsApi;
