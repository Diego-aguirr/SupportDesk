import { ThemeSelector } from '@/features/settings/ThemeSelector';
import { ShortcutManager } from '@/features/settings/ShortcutManager';

export function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-text)]">Settings</h1>
      <div className="space-y-8">
        <ThemeSelector />
        <ShortcutManager />
      </div>
    </div>
  );
}
