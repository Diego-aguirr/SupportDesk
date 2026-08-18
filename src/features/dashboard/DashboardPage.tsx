import { useGetStatsQuery } from '@/features/dashboard/dashboardApi';
import { StatCard } from '@/features/dashboard/StatCard';
import { StatusPieChart } from '@/features/dashboard/charts/StatusPieChart';
import { PriorityBarChart } from '@/features/dashboard/charts/PriorityBarChart';
import { TrendLineChart } from '@/features/dashboard/charts/TrendLineChart';

export function DashboardPage() {
  const { data: stats, isLoading, error } = useGetStatsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-500">Error loading dashboard</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Open" value={stats.open} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Resolved" value={stats.resolved} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatusPieChart data={stats.byStatus} />
        <PriorityBarChart data={stats.byPriority} />
        <TrendLineChart data={stats.trend} />
      </div>
    </div>
  );
}
