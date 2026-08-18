import { useAppSelector, useAppDispatch } from '@/hooks';
import { setTheme } from '@/features/settings/settingsSlice';
import type { Theme } from '@/types';

export function ThemeSelector() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((s) => s.settings.theme);

  const options: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">Theme</h3>
      <div className="flex gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => dispatch(setTheme(opt.value))}
            aria-pressed={currentTheme === opt.value}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              currentTheme === opt.value
                ? 'bg-[var(--color-primary)] text-white'
                : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
