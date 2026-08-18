interface StatCardProps {
  label: string;
  value: number;
  trend?: number; // positive = up, negative = down
}

export function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-[var(--color-text)]">{value}</span>
        {trend !== undefined && (
          <span
            className={`text-sm font-medium ${
              trend >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
            }`}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
