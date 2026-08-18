import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { logout } from '@/features/auth/authSlice';
import { ThemeSelector } from '@/features/settings/ThemeSelector';
import { ShortcutManager } from '@/features/settings/ShortcutManager';
import { UsageInstructions } from '@/features/settings/UsageInstructions';

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/tickets')}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          >
            Tickets
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-error)] hover:text-white transition-colors"
            aria-label="Log out"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="space-y-8">
        <ThemeSelector />
        <ShortcutManager />
        <UsageInstructions />
      </div>
    </div>
  );
}
