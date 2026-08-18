import { http, HttpResponse } from 'msw';
import { demoUsers } from '../data/users';
import { delay, shouldError } from '../helpers';

export const authHandlers = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as { email: string; password: string };

    if (!body.email || !body.email.includes('@')) {
      return HttpResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      );
    }

    if (!body.password || body.password.length < 6) {
      return HttpResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      );
    }

    const user = demoUsers.find((u) => u.email === body.email);

    if (!user) {
      return HttpResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      user,
      token: `mock-jwt-token-${user.id}`,
    });
  }),

  http.get('/api/v1/users/me', async ({ request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-jwt-token-', '');
    const user = demoUsers.find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(user);
  }),

  http.post('/api/v1/auth/logout', async () => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    return HttpResponse.json({ success: true });
  }),
];
