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
      tint: 'from-orange-500/20 to-amber-500/10'
    },
    {
      label: 'Total leads',
      value: totalLeads,
      icon: Users,
      tint: 'from-blue-500/20 to-cyan-500/10'
    },
    {
      label: 'Active statuses',
      value: activeStatuses,
      icon: Sparkles,
      tint: 'from-violet-500/20 to-fuchsia-500/10'
    },
    {
      label: 'Recent (top 8)',
      value: recentAdds,
      icon: TrendingUp,
      tint: 'from-emerald-500/20 to-teal-500/10'
    }
  ];
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className='relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40 p-4'
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${c.tint} opacity-50`} />
            <div className='relative flex items-start justify-between'>
              <div>
                <p className='text-xs text-zinc-400'>{c.label}</p>
                <p className='mt-1 text-2xl font-semibold tracking-tight'>{c.value}</p>
              </div>
              <Icon className='h-4 w-4 text-zinc-400' />
            </div>
          </div>
        );
      })}
    </div>
  );
}
