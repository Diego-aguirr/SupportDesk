import type { PaginatedResponse, Ticket, TicketFilters, TicketPriority } from '@/types';

const PRIORITY_ORDER: Record<TicketPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  urgent: 3,
};

export function paginate<T>(
  data: T[],
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (safePage - 1) * pageSize;

  return {
    data: data.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export function filterTickets(tickets: Ticket[], filters: TicketFilters): Ticket[] {
  let result = [...tickets];

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    result = result.filter((t) => filters.status!.includes(t.status));
  }

  // Filter by priority
  if (filters.priority && filters.priority.length > 0) {
    result = result.filter((t) => filters.priority!.includes(t.priority));
  }

  // Filter by assignee
  if (filters.assigneeId) {
    result = result.filter((t) => t.assignee?.id === filters.assigneeId);
  }

  // Search in title and description
  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term),
    );
  }

  // Sort
  if (filters.sortBy) {
    const dir = filters.sortDir === 'asc' ? 1 : -1;
    result.sort((a, b) => {
      if (filters.sortBy === 'priority') {
        return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;
      }
      const aVal = a[filters.sortBy!];
      const bVal = b[filters.sortBy!];
      return (new Date(aVal).getTime() - new Date(bVal).getTime()) * dir;
    });
  }

  return result;
}

export async function delay(ms?: number): Promise<void> {
  const duration = ms ?? fakerNumber(200, 800);
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function fakerNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shouldError(): boolean {
  return Math.random() < 0.05;
}
