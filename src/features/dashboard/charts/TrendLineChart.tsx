import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendLineChartProps {
  data: { date: string; count: number }[];
}

export function TrendLineChart({ data }: TrendLineChartProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h3 className="mb-4 text-sm font-medium text-[var(--color-muted)]">Trend (Last 7 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
