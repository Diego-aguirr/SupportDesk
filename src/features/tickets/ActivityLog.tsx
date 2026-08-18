import type { ActivityLogEntry } from '@/types';
import { formatDate } from '@/lib/utils';

interface ActivityLogProps {
  entries: ActivityLogEntry[];
}

const ACTION_LABELS: Record<string, string> = {
  created: 'created this ticket',
  status_changed: 'changed status',
  priority_changed: 'changed priority',
  assigned: 'assigned ticket',
  commented: 'added a comment',
};

export function ActivityLog({ entries }: ActivityLogProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-[var(--color-muted)]">
        Activity ({entries.length})
      </h2>

      <div className="space-y-3">
        {[...entries]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 text-sm"
            >
              {/* Timeline dot */}
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--color-primary)]" />

              <div>
                <p className="text-[var(--color-text)]">
                  <span className="font-medium">{entry.actor.name}</span>{' '}
                  {ACTION_LABELS[entry.action] ?? entry.action}
                  {entry.from && entry.to && (
                    <span className="text-[var(--color-muted)]">
                      {' '}from <span className="font-medium">{entry.from}</span> to{' '}
                      <span className="font-medium">{entry.to}</span>
                    </span>
                  )}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {formatDate(entry.timestamp)}
                </p>
              </div>
            </div>
          ))}

        {entries.length === 0 && (
          <p className="text-sm text-[var(--color-muted)] italic">No activity yet</p>
        )}
      </div>
    </div>
  );
}
