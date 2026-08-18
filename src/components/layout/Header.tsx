import { useAppSelector } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { logout } from '@/features/auth/authSlice';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-[var(--color-muted)] hover:text-[var(--color-text)] lg:hidden"
        aria-label="Open menu"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* User info + logout */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <img
              src={user.avatar}
              alt=""
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm text-[var(--color-text)] hidden sm:inline">
              {user.name}
            </span>
          </>
        )}
        <button
          onClick={handleLogout}
          className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-muted)] hover:border-[var(--color-error)] hover:text-[var(--color-error)] transition-colors"
          aria-label="Log out"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
