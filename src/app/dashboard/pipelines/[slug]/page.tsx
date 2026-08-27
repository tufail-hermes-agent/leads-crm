import { notFound, redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard-shell';
import { LeadsTable } from '@/components/leads-table';
import { LeadFilters } from '@/components/lead-filters';
import { Users } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Pipeline — Protech Leads CRM' };

export default async function PipelineDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string; locality?: string; q?: string }>;
}) {
  const session = await getAdmin();
  if (!session) redirect('/login');
  const { slug } = await params;
  const sp = await searchParams;

  const pipeline = await prisma.pipeline.findUnique({ where: { slug } });
  if (!pipeline) notFound();

  const where: Record<string, unknown> = { pipelineId: pipeline.id };
  if (sp.status) where.status = sp.status;
  if (sp.locality) where.locality = sp.locality;
  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q, mode: 'insensitive' } },
      { phone: { contains: sp.q, mode: 'insensitive' } },
      { address: { contains: sp.q, mode: 'insensitive' } },
      { locality: { contains: sp.q, mode: 'insensitive' } }
    ];
  }

  const [leads, distinctLocalities, statusCounts] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' }, take: 1000 }),
    prisma.lead.findMany({
      where: { pipelineId: pipeline.id },
      select: { locality: true },
      distinct: ['locality']
    }),
    prisma.lead.groupBy({
      by: ['status'],
      where: { pipelineId: pipeline.id },
      _count: { _all: true }
    })
  ]);

  return (
    <DashboardShell user={null}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-2 text-xs text-zinc-500'>
              <Link href='/dashboard/pipelines' className='hover:text-zinc-300'>
                Pipelines
              </Link>
              <span>/</span>
              <span>{pipeline.name}</span>
            </div>
            <h1 className='mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight'>
              <Users className='h-5 w-5' />
              {pipeline.name}
            </h1>
            {pipeline.description && (
              <p className='text-sm text-zinc-400'>{pipeline.description}</p>
            )}
            <p className='mt-1 text-xs text-zinc-500'>
              {leads.length} lead{leads.length === 1 ? '' : 's'} shown ·{' '}
              {statusCounts.reduce((a, s) => a + s._count._all, 0)} total
            </p>
          </div>
        </div>

        <LeadFilters
          pipelineId={pipeline.id}
          localities={distinctLocalities.map((l) => l.locality).filter(Boolean) as string[]}
          statusCounts={statusCounts.map((s) => ({ status: s.status, _count: s._count._all }))}
        />

        <LeadsTable leads={leads} pipelineId={pipeline.id} />
      </div>
    </DashboardShell>
  );
}
