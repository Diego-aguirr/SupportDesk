import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { STATUS_OPTIONS } from '@/lib/constants';

interface StatusPieChartProps {
  data: { status: string; count: number }[];
}

const COLORS = STATUS_OPTIONS.map((s) => {
  const map: Record<string, string> = {
    open: '#3b82f6',
    in_progress: '#eab308',
    pending: '#f97316',
    resolved: '#22c55e',
    closed: '#6b7280',
  };
  return map[s.value] ?? '#6b7280';
});

export function StatusPieChart({ data }: StatusPieChartProps) {
  const navigate = useNavigate();

  const handleClick = (_: unknown, index: number) => {
    const status = data[index]?.status;
    if (status) navigate(`/tickets?status=${status}`);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h3 className="mb-4 text-sm font-medium text-[var(--color-muted)]">By Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {data.map((item, i) => (
          <div key={item.status} className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {item.status.replace('_', ' ')} ({item.count})
          </div>
        ))}
      </div>
    </div>
  );
}
