import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetTicketsQuery } from '@/features/tickets/ticketsApi';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { logout } from '@/features/auth/authSlice';
import { SearchInput } from '@/features/shared/SearchInput';
import { TicketFilters } from '@/features/tickets/TicketFilters';
import type { TicketFilters as TicketFiltersType } from '@/types';

export function TicketListPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const filters: TicketFilters = {
    page: Number(searchParams.get('page') || '1'),
    pageSize: Number(searchParams.get('pageSize') || '20'),
    search: searchParams.get('q') || undefined,
    status: searchParams.getAll('status') as TicketFilters['status'],
    priority: searchParams.getAll('priority') as TicketFilters['priority'],
    sortBy: (searchParams.get('sortBy') as TicketFilters['sortBy']) || 'updatedAt',
    sortDir: (searchParams.get('sortDir') as TicketFilters['sortDir']) || 'desc',
  };

  const { data, isLoading, error } = useGetTicketsQuery(filters);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error loading tickets. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6">
      {/* Header con usuario y botón salir */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Tickets</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Signed in as {user?.name ?? 'Unknown'} ({user?.role})
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-error)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
          aria-label="Log out of SupportDesk"
        >
          Log out
        </button>
      </header>

      <p className="mb-4 text-[var(--color-muted)]">
        {data?.total ?? 0} tickets found
      </p>

      <div className="space-y-4">
        <SearchInput />
        <TicketFilters />
        <p className="text-sm text-[var(--color-muted)] italic">
          [ TicketTable va aquí ]
        </p>
        <p className="text-sm text-[var(--color-muted)] italic">
          [ Pagination va aquí ]
        </p>
      </div>
    </div>
  );
}
