import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
);

const TicketListPage = lazy(() =>
  import('@/features/tickets/TicketListPage').then((m) => ({ default: m.TicketListPage })),
);

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h2 className="text-xl text-[var(--color-muted)]">{title}</h2>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="/tickets/:id" element={<Placeholder title="Ticket Detail — coming in PR 4" />} />
          <Route path="/dashboard" element={<Placeholder title="Dashboard — coming in PR 5" />} />
          <Route path="/settings" element={<Placeholder title="Settings — coming in PR 5" />} />
        </Route>
        <Route path="*" element={<Placeholder title="404 — Not Found" />} />
      </Routes>
    </Suspense>
  );
}
