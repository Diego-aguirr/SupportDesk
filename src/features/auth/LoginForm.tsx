import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const DEMO_CREDENTIALS = [
  { label: 'Admin', email: 'admin@supportdesk.com', password: 'password123' },
  { label: 'Agent', email: 'agent@supportdesk.com', password: 'password123' },
] as const;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  serverError?: string | null;
}

export function LoginForm({ onSubmit, isLoading, serverError }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const inputClass =
    'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20';

  const errorClass = 'text-sm text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Demo credential chips */}
      <div className="space-y-2">
        <p className="text-sm text-[var(--color-muted)]">Quick login:</p>
        <div className="flex gap-2">
          {DEMO_CREDENTIALS.map((cred) => (
            <button
              key={cred.label}
              type="button"
              onClick={() => {
                setValue('email', cred.email, { shouldValidate: true });
                setValue('password', cred.password, { shouldValidate: true });
              }}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
            >
              {cred.label}
            </button>
          ))}
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
        >
          {serverError}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-label="Email address"
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={!!errors.email}
          placeholder="you@company.com"
          className={inputClass}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className={errorClass} role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-label="Password"
          aria-describedby={errors.password ? 'password-error' : undefined}
          aria-invalid={!!errors.password}
          placeholder="••••••"
          className={inputClass}
          {...register('password')}
        />
        {errors.password && (
          <p id="password-error" className={errorClass} role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
