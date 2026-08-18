import { http, HttpResponse } from 'msw';
import { tickets } from '../data/tickets';
import type { TicketStatus, TicketPriority } from '@/types';
import { delay, shouldError } from '../helpers';

interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  avgResolutionTime: number;
  byPriority: Record<TicketPriority, number>;
  byStatus: Record<TicketStatus, number>;
  trend: { date: string; count: number }[];
}

function computeStats(): DashboardStats {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === 'open').length;
  const inProgress = tickets.filter((t) => t.status === 'in_progress').length;
  const resolved = tickets.filter((t) => t.status === 'resolved').length;
  const closed = tickets.filter((t) => t.status === 'closed').length;

  // Average resolution time in days
  const resolvedTickets = tickets.filter(
    (t) => t.status === 'resolved' || t.status === 'closed',
  );
  const avgResolutionTime =
    resolvedTickets.length > 0
      ? resolvedTickets.reduce((acc, t) => {
          const created = new Date(t.createdAt).getTime();
          const updated = new Date(t.updatedAt).getTime();
          return acc + (updated - created);
        }, 0) /
        resolvedTickets.length /
        (1000 * 60 * 60 * 24)
      : 0;

  const byPriority: Record<TicketPriority, number> = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0,
  };
  const byStatus: Record<TicketStatus, number> = {
    open: 0,
    in_progress: 0,
    pending: 0,
    resolved: 0,
    closed: 0,
  };

  for (const t of tickets) {
    byPriority[t.priority]++;
    byStatus[t.status]++;
  }

  // Last 7 days trend
  const trend: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = tickets.filter(
      (t) => t.createdAt.split('T')[0] === dateStr,
    ).length;
    trend.push({ date: dateStr, count });
  }

  return {
    total,
    open,
    inProgress,
    resolved,
    closed,
    avgResolutionTime,
    byPriority,
    byStatus,
    trend,
  };
}

export const dashboardHandlers = [
  http.get('/api/v1/dashboard/stats', async () => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    return HttpResponse.json(computeStats());
  }),
];
