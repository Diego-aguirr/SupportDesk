import { useSearchParams } from 'react-router-dom';
import { useGetTicketsQuery } from '@/features/tickets/ticketsApi';
import { SearchInput } from '@/features/shared/SearchInput';
import { Pagination } from '@/features/shared/Pagination';
import { TicketFilters } from '@/features/tickets/TicketFilters';
import { TicketTable } from '@/features/tickets/TicketTable';
import type { TicketFilters as TicketFiltersType } from '@/types';
import { useState } from 'react';

export function TicketListPage() {
  const [searchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filters: TicketFiltersType = {
    page: Number(searchParams.get('page') || '1'),
    pageSize: Number(searchParams.get('pageSize') || '20'),
    search: searchParams.get('q') || undefined,
    status: searchParams.getAll('status') as TicketFiltersType['status'],
    priority: searchParams.getAll('priority') as TicketFiltersType['priority'],
    sortBy: (searchParams.get('sortBy') as TicketFiltersType['sortBy']) || 'updatedAt',
    sortDir: (searchParams.get('sortDir') as TicketFiltersType['sortDir']) || 'desc',
  };

  const { data, isLoading, error } = useGetTicketsQuery(filters);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-500">Error loading tickets. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold text-[var(--color-text)]">Tickets</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        {data?.total ?? 0} tickets found
      </p>

      <div className="space-y-4">
        <SearchInput />
        <TicketFilters />
        <TicketTable tickets={data?.data ?? []} selectedIds={selectedIds} onSelect={setSelectedIds} />
        <Pagination
          total={data?.total ?? 0}
          page={data?.page ?? 1}
          pageSize={data?.pageSize ?? 20}
          totalPages={data?.totalPages ?? 1}
        />
      </div>
    </div>
  );
}
