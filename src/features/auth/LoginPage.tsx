import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import { useLoginMutation } from '@/features/auth/authApi';
import { LoginForm } from '@/features/auth/LoginForm';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [login, { isLoading, error }] = useLoginMutation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tickets', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      navigate('/tickets');
      toast.success('Welcome back!');
    } catch (err) {
      const message =
        (err as { data?: { error?: string } })?.data?.error ?? 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  const errorMessage =
    error && 'data' in error
      ? (error.data as { error?: string })?.error ?? 'Login failed'
      : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">SupportDesk</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Sign in to manage your support tickets
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} serverError={errorMessage} />
        </div>
      </div>
    </div>
  );
}
