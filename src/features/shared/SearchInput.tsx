import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';

export function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSearch = searchParams.get('q') ?? '';
  const [localValue, setLocalValue] = useState(currentSearch);

  // Debounce: esperamos 300ms después de que el usuario deja de escribir
  const debouncedValue = useDebounce(localValue, 300);

  // Cuando el debounce se resuelve, actualizamos la URL
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedValue && debouncedValue.length >= 2) {
        next.set('q', debouncedValue);
      } else {
        next.delete('q');
      }
      return next;
    }, { replace: true });
  }, [debouncedValue, setSearchParams]);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search tickets... (min 2 chars)"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        aria-label="Search tickets"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete('q');
              return next;
            }, { replace: true });
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
