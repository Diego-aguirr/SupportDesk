import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PriorityBarChartProps {
  data: { priority: string; count: number }[];
}

const COLORS: Record<string, string> = {
  low: '#94a3b8',
  medium: '#eab308',
  high: '#f97316',
  urgent: '#ef4444',
};

export function PriorityBarChart({ data }: PriorityBarChartProps) {
  const navigate = useNavigate();

  const handleClick = (data: unknown) => {
    const priority = (data as { priority?: string })?.priority;
    if (priority) navigate(`/tickets?priority=${priority}`);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h3 className="mb-4 text-sm font-medium text-[var(--color-muted)]">By Priority</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} onClick={handleClick} style={{ cursor: 'pointer' }}>
            <XAxis dataKey="priority" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <rect key={entry.priority} fill={COLORS[entry.priority] ?? '#6b7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
