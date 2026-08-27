import { Layers, Users, Sparkles, TrendingUp } from 'lucide-react';

export function OverviewCards({
  totalPipelines,
  totalLeads,
  activeStatuses,
  recentAdds
}: {
  totalPipelines: number;
  totalLeads: number;
  activeStatuses: number;
  recentAdds: number;
}) {
  const cards = [
    {
      label: 'Pipelines',
      value: totalPipelines,
      icon: Layers,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      label: 'Total leads',
      value: totalLeads,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Active statuses',
      value: activeStatuses,
      icon: Sparkles,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600'
    },
    {
      label: 'Recent (top 8)',
      value: recentAdds,
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    }
  ];
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className='rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md'
          >
            <div className={`grid h-9 w-9 place-items-center rounded-full ${c.iconBg}`}>
              <Icon className={`h-4 w-4 ${c.iconColor}`} />
            </div>
            <p className='mt-3 text-2xl font-semibold tracking-tight text-foreground'>{c.value}</p>
            <p className='text-xs text-muted-foreground'>{c.label}</p>
          </div>
        );
      })}
    </div>
  );
}
