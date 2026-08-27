import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard-shell';
import { OverviewCards } from '@/components/overview-cards';
import { Activity, Users, Layers, TrendingUp } from 'lucide-react';

export const metadata = { title: 'Dashboard — Protech Leads CRM' };

export default async function DashboardHome() {
  const session = await getAdmin();
  if (!session) redirect('/login');

  const [pipelines, totalLeads, recentLeads, byStatus] = await Promise.all([
    prisma.pipeline.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.lead.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { pipeline: { select: { name: true, slug: true, color: true } } }
    }),
    prisma.lead.groupBy({ by: ['status'], _count: { _all: true } })
  ]);

  return (
    <DashboardShell user={null}>
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Overview</h1>
          <p className='text-sm text-zinc-400'>All your pipelines at a glance</p>
        </div>

        <OverviewCards
          totalPipelines={pipelines.length}
          totalLeads={totalLeads}
          activeStatuses={byStatus.filter((s) => !['won', 'lost'].includes(s.status)).length}
          recentAdds={recentLeads.length}
        />

        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='rounded-lg border border-zinc-800 bg-zinc-900/40 lg:col-span-2'>
            <div className='flex items-center justify-between border-b border-zinc-800 px-4 py-3'>
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-zinc-400' />
                <h2 className='text-sm font-medium'>Recent leads</h2>
              </div>
              <Link
                className='text-xs text-zinc-400 hover:text-zinc-100'
                href='/dashboard/pipelines'
              >
                View all
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className='px-4 py-10 text-center text-sm text-zinc-500'>
                No leads yet — start by creating a pipeline.
              </p>
            ) : (
              <ul className='divide-y divide-zinc-800'>
                {recentLeads.map((l) => (
                  <li key={l.id} className='flex items-center justify-between px-4 py-3'>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>{l.name}</p>
                      <p className='truncate text-xs text-zinc-500'>
                        {l.pipeline.name} · {l.locality ?? l.city ?? '—'}
                      </p>
                    </div>
                    <span className='text-xs text-zinc-500'>
                      {new Date(l.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='rounded-lg border border-zinc-800 bg-zinc-900/40'>
            <div className='flex items-center gap-2 border-b border-zinc-800 px-4 py-3'>
              <TrendingUp className='h-4 w-4 text-zinc-400' />
              <h2 className='text-sm font-medium'>By status</h2>
            </div>
            <ul className='space-y-2 px-4 py-3'>
              {byStatus.length === 0 && <p className='text-sm text-zinc-500'>No data yet.</p>}
              {byStatus.map((s) => (
                <li key={s.status} className='flex items-center justify-between text-sm'>
                  <span className='capitalize text-zinc-300'>{s.status}</span>
                  <span className='text-zinc-500'>{s._count._all}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='rounded-lg border border-zinc-800 bg-zinc-900/40'>
          <div className='flex items-center justify-between border-b border-zinc-800 px-4 py-3'>
            <div className='flex items-center gap-2'>
              <Layers className='h-4 w-4 text-zinc-400' />
              <h2 className='text-sm font-medium'>Pipelines</h2>
            </div>
            <Link className='text-xs text-zinc-400 hover:text-zinc-100' href='/dashboard/pipelines'>
              Manage
            </Link>
          </div>
          {pipelines.length === 0 ? (
            <p className='px-4 py-10 text-center text-sm text-zinc-500'>
              No pipelines yet.{' '}
              <Link href='/dashboard/pipelines' className='underline'>
                Create your first
              </Link>
              .
            </p>
          ) : (
            <ul className='grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3'>
              {pipelines.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/dashboard/pipelines/${p.slug}`}
                    className='block rounded-md border border-zinc-800 bg-zinc-950/40 p-3 hover:border-zinc-700'
                  >
                    <p className='text-sm font-medium'>{p.name}</p>
                    {p.description && <p className='mt-1 text-xs text-zinc-500'>{p.description}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
