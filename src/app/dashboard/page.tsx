import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard-shell';
import { OverviewCards } from '@/components/overview-cards';
import { StatusDonut } from '@/components/status-donut';
import { Users, Layers, TrendingUp, ArrowRight, Upload } from 'lucide-react';

export const metadata = { title: 'Dashboard — Protech Leads CRM' };

const COLOR_DOT: Record<string, string> = {
  orange: 'bg-amber-500',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  purple: 'bg-violet-500',
  pink: 'bg-pink-500',
  yellow: 'bg-yellow-500'
};

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
          <h1 className='text-2xl font-semibold tracking-tight text-foreground'>Overview</h1>
          <p className='text-sm text-muted-foreground'>All your pipelines at a glance</p>
        </div>

        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-blue-500 p-6 shadow-lg shadow-blue-600/20 sm:p-8'>
          <div className='absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl' />
          <div className='absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10 blur-2xl' />
          <div className='relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div className='max-w-md'>
              <h2 className='text-xl font-semibold text-white'>Bring in leads faster</h2>
              <p className='mt-1 text-sm text-blue-100'>
                Add a lead by hand or bulk-import a spreadsheet — either way it lands straight in
                the right pipeline.
              </p>
            </div>
            <div className='flex shrink-0 items-center gap-2'>
              <Link
                href='/dashboard/import'
                className='inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20'
              >
                <Upload className='h-4 w-4' />
                Import CSV
              </Link>
              <Link
                href='/dashboard/pipelines'
                className='inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-blue-50'
              >
                Go to pipelines
                <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
          </div>
        </div>

        <OverviewCards
          totalPipelines={pipelines.length}
          totalLeads={totalLeads}
          activeStatuses={byStatus.filter((s) => !['won', 'lost'].includes(s.status)).length}
          recentAdds={recentLeads.length}
        />

        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:col-span-2'>
            <div className='flex items-center justify-between border-b border-border px-5 py-4'>
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-muted-foreground' />
                <h2 className='text-sm font-semibold text-foreground'>Recent leads</h2>
              </div>
              <Link
                className='text-xs font-medium text-primary hover:underline'
                href='/dashboard/pipelines'
              >
                View all
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className='px-5 py-10 text-center text-sm text-muted-foreground'>
                No leads yet — start by creating a pipeline.
              </p>
            ) : (
              <ul className='divide-y divide-border'>
                {recentLeads.map((l) => (
                  <li
                    key={l.id}
                    className='flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/40'
                  >
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium text-foreground'>{l.name}</p>
                      <p className='truncate text-xs text-muted-foreground'>
                        {l.pipeline.name} · {l.locality ?? l.city ?? '—'}
                      </p>
                    </div>
                    <span className='shrink-0 text-xs text-muted-foreground'>
                      {new Date(l.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='rounded-2xl border border-border bg-card p-5 shadow-sm'>
            <div className='mb-4 flex items-center gap-2'>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
              <h2 className='text-sm font-semibold text-foreground'>By status</h2>
            </div>
            <StatusDonut
              data={byStatus.map((s) => ({ status: s.status, _count: s._count._all }))}
            />
          </div>
        </div>

        <div className='overflow-hidden rounded-2xl border border-border bg-card shadow-sm'>
          <div className='flex items-center justify-between border-b border-border px-5 py-4'>
            <div className='flex items-center gap-2'>
              <Layers className='h-4 w-4 text-muted-foreground' />
              <h2 className='text-sm font-semibold text-foreground'>Pipelines</h2>
            </div>
            <Link
              className='text-xs font-medium text-primary hover:underline'
              href='/dashboard/pipelines'
            >
              Manage
            </Link>
          </div>
          {pipelines.length === 0 ? (
            <p className='px-5 py-10 text-center text-sm text-muted-foreground'>
              No pipelines yet.{' '}
              <Link href='/dashboard/pipelines' className='text-primary underline'>
                Create your first
              </Link>
              .
            </p>
          ) : (
            <ul className='grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3'>
              {pipelines.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/dashboard/pipelines/${p.slug}`}
                    className='group block rounded-xl border border-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
                  >
                    <div className='flex items-center gap-2'>
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${COLOR_DOT[p.color] ?? 'bg-slate-400'}`}
                      />
                      <p className='truncate text-sm font-medium text-foreground'>{p.name}</p>
                    </div>
                    {p.description && (
                      <p className='mt-1.5 line-clamp-2 text-xs text-muted-foreground'>
                        {p.description}
                      </p>
                    )}
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
