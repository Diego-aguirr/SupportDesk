import { faker } from '@faker-js/faker';
import type { User } from '@/types';

faker.seed(42);

export const demoUsers: User[] = [
  {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: 'admin@supportdesk.com',
    role: 'admin',
    avatar: faker.image.avatar(),
  },
  {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: 'agent@supportdesk.com',
    role: 'agent',
    avatar: faker.image.avatar(),
  },
];
