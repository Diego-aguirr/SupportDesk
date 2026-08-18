import { http, HttpResponse } from 'msw';
import { tickets } from '../data/tickets';
import { delay, shouldError } from '../helpers';

export const dashboardHandlers = [
  http.get('/api/v1/dashboard/stats', async () => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const total = tickets.length;
    const open = tickets.filter((t) => t.status === 'open').length;
    const inProgress = tickets.filter((t) => t.status === 'in_progress').length;
    const resolved = tickets.filter((t) => t.status === 'resolved').length;
    const closed = tickets.filter((t) => t.status === 'closed').length;

    const byPriority = [
      { priority: 'low', count: tickets.filter((t) => t.priority === 'low').length },
      { priority: 'medium', count: tickets.filter((t) => t.priority === 'medium').length },
      { priority: 'high', count: tickets.filter((t) => t.priority === 'high').length },
      { priority: 'urgent', count: tickets.filter((t) => t.priority === 'urgent').length },
    ];

    const byStatus = [
      { status: 'open', count: tickets.filter((t) => t.status === 'open').length },
      { status: 'in_progress', count: tickets.filter((t) => t.status === 'in_progress').length },
      { status: 'pending', count: tickets.filter((t) => t.status === 'pending').length },
      { status: 'resolved', count: tickets.filter((t) => t.status === 'resolved').length },
      { status: 'closed', count: tickets.filter((t) => t.status === 'closed').length },
    ];

    const trend: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = tickets.filter((t) => t.createdAt.split('T')[0] === dateStr).length;
      trend.push({ date: dateStr, count });
    }

    return HttpResponse.json({
      total,
      open,
      inProgress,
      resolved,
      closed,
      avgResolutionTime: '2.3 days',
      byPriority,
      byStatus,
      trend,
    });
  }),
];
