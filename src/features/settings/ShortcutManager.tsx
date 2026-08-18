import { useAppSelector, useAppDispatch } from '@/hooks';
import { toggleShortcut, resetShortcuts } from '@/features/settings/settingsSlice';

export function ShortcutManager() {
  const dispatch = useAppDispatch();
  const shortcuts = useAppSelector((s) => s.settings.shortcuts);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--color-text)]">Keyboard Shortcuts</h3>
        <button
          onClick={() => dispatch(resetShortcuts())}
          className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          Reset to defaults
        </button>
      </div>

      <div className="space-y-2">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.id}
            className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">{shortcut.label}</p>
              <p className="text-xs text-[var(--color-muted)]">
                {shortcut.keys.join(' + ')}
              </p>
            </div>
            <button
              onClick={() => dispatch(toggleShortcut(shortcut.id))}
              role="switch"
              aria-checked={shortcut.enabled}
              aria-label={`Toggle ${shortcut.label}`}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                shortcut.enabled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  shortcut.enabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
