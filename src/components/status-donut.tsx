'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { statusInfo } from '@/lib/lead-status';

const DOT_COLOR: Record<string, string> = {
  new: '#71717a',
  contacted: '#2563eb',
  interested: '#f59e0b',
  trial: '#8b5cf6',
  won: '#10b981',
  lost: '#f43f5e'
};

export function StatusDonut({ data }: { data: { status: string; _count: number }[] }) {
  const total = data.reduce((a, s) => a + s._count, 0);
  const chartData = data.map((s) => ({
    name: statusInfo(s.status).label,
    value: s._count,
    color: DOT_COLOR[s.status] ?? '#94a3b8'
  }));

  if (total === 0) {
    return <p className='py-10 text-center text-sm text-muted-foreground'>No data yet.</p>;
  }

  return (
    <div>
      <div className='relative mx-auto h-40 w-40'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
              innerRadius={52}
              outerRadius={72}
              paddingAngle={2}
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid var(--color-border)',
                fontSize: 12
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className='pointer-events-none absolute inset-0 grid place-items-center'>
          <div className='text-center'>
            <p className='text-xl font-semibold text-foreground'>{total}</p>
            <p className='text-[10px] text-muted-foreground'>leads</p>
          </div>
        </div>
      </div>
      <ul className='mt-4 space-y-2'>
        {data.map((s) => (
          <li key={s.status} className='flex items-center justify-between text-sm'>
            <span className='flex items-center gap-2 text-foreground'>
              <span
                className='h-2 w-2 rounded-full'
                style={{ backgroundColor: DOT_COLOR[s.status] ?? '#94a3b8' }}
              />
              {statusInfo(s.status).label}
            </span>
            <span className='font-medium text-muted-foreground'>{s._count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
