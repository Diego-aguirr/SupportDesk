import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Ticket } from '@/types';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface TicketTableProps {
  tickets: Ticket[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
}

export function TicketTable({ tickets, selectedIds, onSelect }: TicketTableProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get('sortBy') || 'updatedAt';
  const sortDir = searchParams.get('sortDir') || 'desc';

  const handleSort = (column: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (sortBy === column) {
        next.set('sortDir', sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        next.set('sortBy', column);
        next.set('sortDir', 'desc');
      }
      return next;
    }, { replace: true });
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return '↕';
    return sortDir === 'asc' ? '↑' : '↓';
  };

  const handleSelectAll = () => {
    if (selectedIds.length === tickets.length) {
      onSelect([]);
    } else {
      onSelect(tickets.map((t) => t.id));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter((i) => i !== id));
    } else {
      onSelect([...selectedIds, id]);
    }
  };

  const statusColor = (status: string) =>
    STATUS_OPTIONS.find((s) => s.value === status)?.color ?? 'bg-gray-400';

  const priorityColor = (priority: string) =>
    PRIORITY_OPTIONS.find((p) => p.value === priority)?.color ?? 'bg-gray-400';

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-left text-sm" role="grid">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* Checkbox */}
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={selectedIds.length === tickets.length && tickets.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
                aria-label="Select all tickets"
              />
            </th>
            {/* Sortable columns */}
            {[
              { key: 'id', label: 'ID' },
              { key: 'title', label: 'Title' },
              { key: 'status', label: 'Status' },
              { key: 'priority', label: 'Priority' },
              { key: 'assignee', label: 'Assignee' },
              { key: 'updatedAt', label: 'Updated' },
            ].map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 font-medium text-[var(--color-muted)]"
              >
                <button
                  onClick={() => handleSort(col.key)}
                  className="flex items-center gap-1 hover:text-[var(--color-text)]"
                  aria-sort={sortBy === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  {col.label}
                  <span className="text-xs">{getSortIcon(col.key)}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface)]"
              onClick={() => navigate(`/tickets/${ticket.id}`)}
            >
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(ticket.id)}
                  onChange={() => handleSelectOne(ticket.id)}
                  className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
                  aria-label={`Select ticket ${ticket.id}`}
                />
              </td>
              <td className="px-4 py-3 font-mono text-[var(--color-muted)]">#{ticket.id}</td>
              <td className="px-4 py-3 font-medium text-[var(--color-text)]">{ticket.title}</td>
              <td className="px-4 py-3">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white ${statusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white ${priorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-[var(--color-muted)]">
                {ticket.assignee?.name ?? 'Unassigned'}
              </td>
              <td className="px-4 py-3 text-[var(--color-muted)]">
                {formatDate(ticket.updatedAt)}
              </td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-[var(--color-muted)]">
                No tickets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
