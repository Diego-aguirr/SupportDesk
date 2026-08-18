import { useSearchParams } from 'react-router-dom';
import type { TicketStatus, TicketPriority } from '@/types';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/lib/constants';

export function TicketFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedStatuses = searchParams.getAll('status') as TicketStatus[];
  const selectedPriorities = searchParams.getAll('priority') as TicketPriority[];

  const toggleValue = (current: string[], value: string): string[] => {
    return current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
  };

  const updateParams = (key: string, values: string[]) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(key);
      values.forEach((v) => next.append(key, v));
      return next;
    }, { replace: true });
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* Status filters */}
      <div>
        <span className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Status</span>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((opt) => {
            const isActive = selectedStatuses.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => updateParams('status', toggleValue(selectedStatuses, opt.value))}
                aria-pressed={isActive}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority filters */}
      <div>
        <span className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Priority</span>
        <div className="flex flex-wrap gap-1.5">
          {PRIORITY_OPTIONS.map((opt) => {
            const isActive = selectedPriorities.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => updateParams('priority', toggleValue(selectedPriorities, opt.value))}
                aria-pressed={isActive}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear filters */}
      {(selectedStatuses.length > 0 || selectedPriorities.length > 0) && (
        <button
          onClick={() => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete('status');
              next.delete('priority');
              return next;
            }, { replace: true });
          }}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
