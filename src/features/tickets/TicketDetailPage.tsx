import { useParams, useNavigate } from 'react-router-dom';
import { useGetTicketQuery } from '@/features/tickets/ticketsApi';
import { useAppSelector } from '@/hooks';
import { TicketInfo } from '@/features/tickets/TicketInfo';
import { CommentSection } from '@/features/tickets/CommentSection';
import { ActivityLog } from '@/features/tickets/ActivityLog';

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const { data: ticket, isLoading, error } = useGetTicketQuery(Number(id));

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-[var(--color-text)]">Ticket not found</h2>
        <button
          onClick={() => navigate('/tickets')}
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Back to tickets
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/tickets')}
        className="mb-6 flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
        aria-label="Back to ticket list"
      >
        ← Back to tickets
      </button>

      {/* Two column layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left: Ticket info + comments */}
        <div className="space-y-8">
          <TicketInfo ticket={ticket} />
          <CommentSection
            ticketId={ticket.id}
            comments={ticket.comments}
            currentUser={user}
          />
        </div>

        {/* Right: Activity log */}
        <aside className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <ActivityLog entries={ticket.activityLog} />
        </aside>
      </div>
    </div>
  );
}
