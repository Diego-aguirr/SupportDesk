import { useSearchParams } from 'react-router-dom';

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function Pagination({ total, page, pageSize, totalPages }: PaginationProps) {
  const [, setSearchParams] = useSearchParams();

  const goTo = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    }, { replace: true });
  };

  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[var(--color-muted)]">
        Showing <span className="font-medium text-[var(--color-text)]">{start}–{end}</span> of{' '}
        <span className="font-medium text-[var(--color-text)]">{total}</span>
      </p>

      <nav aria-label="Page navigation" className="flex items-center gap-1">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className="rounded-lg px-3 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
          .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis');
            acc.push(p);
            return acc;
          }, [])
          .map((item, i) =>
            item === 'ellipsis' ? (
              <span key={`e${i}`} className="px-2 text-[var(--color-muted)]">…</span>
            ) : (
              <button
                key={item}
                onClick={() => goTo(item)}
                aria-current={item === page ? 'page' : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  item === page
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                }`}
              >
                {item}
              </button>
            ),
          )}

        <button
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg px-3 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </nav>
    </div>
  );
}
