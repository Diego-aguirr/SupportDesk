import type { Ticket, TicketStatus, TicketPriority } from '@/types';
import { useUpdateTicketMutation } from '@/features/tickets/ticketsApi';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface TicketInfoProps {
  ticket: Ticket;
}

export function TicketInfo({ ticket }: TicketInfoProps) {
  const [updateTicket] = useUpdateTicketMutation();

  const handleStatusChange = async (newStatus: TicketStatus) => {
    try {
      await updateTicket({ id: ticket.id, changes: { status: newStatus } }).unwrap();
      toast.success(`Status changed to ${newStatus.replace('_', ' ')}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handlePriorityChange = async (newPriority: TicketPriority) => {
    try {
      await updateTicket({ id: ticket.id, changes: { priority: newPriority } }).unwrap();
      toast.success(`Priority changed to ${newPriority}`);
    } catch {
      toast.error('Failed to update priority');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">{ticket.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Ticket #{ticket.id} · Created {formatDate(ticket.createdAt)}
        </p>
      </div>

      {/* Status + Priority editors */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Status</label>
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            aria-label="Change ticket status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Priority</label>
          <select
            value={ticket.priority}
            onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            aria-label="Change ticket priority"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Assignee</label>
          <p className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]">
            {ticket.assignee?.name ?? 'Unassigned'}
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="mb-2 text-sm font-medium text-[var(--color-muted)]">Description</h2>
        <p className="whitespace-pre-wrap rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text)]">
          {ticket.description}
        </p>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-6 text-xs text-[var(--color-muted)]">
        <span>Created: {formatDate(ticket.createdAt)}</span>
        <span>Updated: {formatDate(ticket.updatedAt)}</span>
        <span>Comments: {ticket.comments.length}</span>
        <span>Activity: {ticket.activityLog.length} entries</span>
      </div>
    </div>
  );
}
