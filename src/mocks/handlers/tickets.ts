import { http, HttpResponse, type StrictResponse } from 'msw';
import type {
  Ticket,
  TicketStatus,
  TicketPriority,
  PaginatedResponse,
  User,
} from '@/types';
import { tickets } from '../data/tickets';
import { demoUsers } from '../data/users';
import { paginate, filterTickets, delay, shouldError } from '../helpers';

type TicketResponse = StrictResponse<
  | { error: string }
  | Ticket
  | PaginatedResponse<Ticket>
>;

function findTicketById(id: string): Ticket | undefined {
  return tickets.find((t) => t.id === Number(id));
}

function getUserFromRequest(request: Request): User {
  const auth = request.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    const user = demoUsers.find((u) => u.id === token);
    if (user) return user;
  }
  return demoUsers[0];
}

export const ticketHandlers = [
  // GET /api/v1/tickets — paginated, filtered, sorted
  http.get('/api/v1/tickets', async ({ request }): Promise<TicketResponse> => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const search = url.searchParams.get('search') ?? undefined;
    const sortBy = (url.searchParams.get('sortBy') ?? undefined) as
      | 'createdAt'
      | 'updatedAt'
      | 'priority'
      | undefined;
    const sortDir = (url.searchParams.get('sortDir') ?? 'desc') as
      | 'asc'
      | 'desc';
    const statusRaw = url.searchParams.get('status');
    const priorityRaw = url.searchParams.get('priority');
    const assigneeId = url.searchParams.get('assigneeId') ?? undefined;

    const status = statusRaw
      ? (statusRaw.split(',').filter(Boolean) as TicketStatus[])
      : undefined;
    const priority = priorityRaw
      ? (priorityRaw.split(',').filter(Boolean) as TicketPriority[])
      : undefined;

    const filtered = filterTickets(tickets, {
      status,
      priority,
      assigneeId: assigneeId ?? undefined,
      search,
      sortBy,
      sortDir,
    });

    return HttpResponse.json(paginate(filtered, page, pageSize));
  }),

  // GET /api/v1/tickets/:id — single ticket
  http.get('/api/v1/tickets/:id', async ({ params }): Promise<TicketResponse> => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const ticket = findTicketById(params.id as string);

    if (!ticket) {
      return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return HttpResponse.json(ticket);
  }),

  // POST /api/v1/tickets — create new ticket
  http.post('/api/v1/tickets', async ({ request }): Promise<TicketResponse> => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const user = getUserFromRequest(request);
    const body = (await request.json()) as Partial<Ticket>;
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      id: tickets.length + 1,
      title: body.title ?? 'Untitled Ticket',
      description: body.description ?? '',
      status: body.status ?? 'open',
      priority: body.priority ?? 'medium',
      assignee: body.assignee ?? null,
      createdAt: now,
      updatedAt: now,
      comments: [],
      activityLog: [
        {
          id: crypto.randomUUID(),
          ticketId: tickets.length + 1,
          actor: user,
          action: 'created',
          timestamp: now,
        },
      ],
    };

    tickets.push(newTicket);
    return HttpResponse.json(newTicket, { status: 201 });
  }),

  // PATCH /api/v1/tickets/:id — partial update
  http.patch('/api/v1/tickets/:id', async ({ params, request }): Promise<TicketResponse> => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const ticket = findTicketById(params.id as string);

    if (!ticket) {
      return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const body = (await request.json()) as Partial<Ticket>;
    const now = new Date().toISOString();
    const user = getUserFromRequest(request);

    // Track status change
    if (body.status && body.status !== ticket.status) {
      ticket.activityLog.push({
        id: crypto.randomUUID(),
        ticketId: ticket.id,
        actor: user,
        action: 'status_changed',
        from: ticket.status,
        to: body.status,
        timestamp: now,
      });
    }

    // Track priority change
    if (body.priority && body.priority !== ticket.priority) {
      ticket.activityLog.push({
        id: crypto.randomUUID(),
        ticketId: ticket.id,
        actor: user,
        action: 'priority_changed',
        from: ticket.priority,
        to: body.priority,
        timestamp: now,
      });
    }

    // Track assignment change
    if (body.assignee !== undefined && body.assignee?.id !== ticket.assignee?.id) {
      ticket.activityLog.push({
        id: crypto.randomUUID(),
        ticketId: ticket.id,
        actor: user,
        action: 'assigned',
        from: ticket.assignee?.id ?? 'unassigned',
        to: body.assignee?.id ?? 'unassigned',
        timestamp: now,
      });
    }

    // Apply updates
    Object.assign(ticket, body, { updatedAt: now });
    return HttpResponse.json(ticket);
  }),

  // DELETE /api/v1/tickets/:id — remove ticket
  http.delete('/api/v1/tickets/:id', async ({ params }): Promise<TicketResponse> => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const index = tickets.findIndex((t) => t.id === Number(params.id));

    if (index === -1) {
      return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    tickets.splice(index, 1);
    return HttpResponse.json({ success: true } as unknown as Ticket);
  }),

  // POST /api/v1/tickets/:id/comments — add comment
  http.post('/api/v1/tickets/:id/comments', async ({ params, request }): Promise<TicketResponse> => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const ticket = findTicketById(params.id as string);

    if (!ticket) {
      return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const body = (await request.json()) as { content: string };
    const now = new Date().toISOString();
    const user = getUserFromRequest(request);

    const comment = {
      id: crypto.randomUUID(),
      ticketId: ticket.id,
      author: user,
      content: body.content,
      createdAt: now,
    };

    ticket.comments.push(comment);
    ticket.activityLog.push({
      id: crypto.randomUUID(),
      ticketId: ticket.id,
      actor: user,
      action: 'commented',
      timestamp: now,
    });
    ticket.updatedAt = now;

    return HttpResponse.json(ticket, { status: 201 });
  }),

  // GET /api/v1/tickets/:id/activity — activity log
  http.get('/api/v1/tickets/:id/activity', async ({ params }): Promise<TicketResponse> => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const ticket = findTicketById(params.id as string);

    if (!ticket) {
      return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return HttpResponse.json(ticket.activityLog as unknown as Ticket);
  }),

  // POST /api/v1/tickets/bulk/status — bulk status change
  http.post('/api/v1/tickets/bulk/status', async ({ request }): Promise<TicketResponse> => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as {
      ticketIds: number[];
      status: TicketStatus;
    };

    const now = new Date().toISOString();
    const user = getUserFromRequest(request);
    const updated: Ticket[] = [];

    for (const id of body.ticketIds) {
      const ticket = findTicketById(String(id));
      if (ticket) {
        ticket.activityLog.push({
          id: crypto.randomUUID(),
          ticketId: ticket.id,
          actor: user,
          action: 'status_changed',
          from: ticket.status,
          to: body.status,
          timestamp: now,
        });
        ticket.status = body.status;
        ticket.updatedAt = now;
        updated.push(ticket);
      }
    }

    return HttpResponse.json(updated as unknown as Ticket);
  }),
];
