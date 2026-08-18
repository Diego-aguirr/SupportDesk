import { faker } from '@faker-js/faker';
import type { Ticket, TicketStatus, TicketPriority, Comment, ActivityLogEntry } from '@/types';
import { demoUsers } from './users';

faker.seed(42);

const STATUSES: TicketStatus[] = ['open', 'in_progress', 'pending', 'resolved', 'closed'];
const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];
const ACTIONS: ActivityLogEntry['action'][] = [
  'created',
  'status_changed',
  'priority_changed',
  'assigned',
  'commented',
];

function generateComments(ticketId: number, count: number): Comment[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    ticketId,
    author: faker.helpers.arrayElement(demoUsers),
    content: faker.lorem.sentences({ min: 1, max: 3 }),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  }));
}

function generateActivityLog(
  ticketId: number,
  count: number,
): ActivityLogEntry[] {
  return Array.from({ length: count }, () => {
    const action = faker.helpers.arrayElement(ACTIONS);
    return {
      id: faker.string.uuid(),
      ticketId,
      actor: faker.helpers.arrayElement(demoUsers),
      action,
      from: action !== 'created' ? faker.word.noun() : undefined,
      to: action !== 'created' ? faker.word.noun() : undefined,
      timestamp: faker.date.recent({ days: 30 }).toISOString(),
    };
  });
}

export const tickets: Ticket[] = Array.from({ length: faker.number.int({ min: 30, max: 50 }) }, (_, i) => {
  const ticketId = i + 1;
  const createdAt = faker.date.recent({ days: 90 });
  const updatedAt = faker.date.recent({ days: 30 });

  return {
    id: ticketId,
    title: faker.lorem.sentence({ min: 4, max: 8 }),
    description: faker.lorem.paragraph({ min: 2, max: 5 }),
    status: faker.helpers.arrayElement(STATUSES),
    priority: faker.helpers.arrayElement(PRIORITIES),
    assignee: faker.helpers.arrayElement([...demoUsers, null]),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    comments: generateComments(ticketId, faker.number.int({ min: 0, max: 5 })),
    activityLog: generateActivityLog(ticketId, faker.number.int({ min: 1, max: 8 })),
  };
});
