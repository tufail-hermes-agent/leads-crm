import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard-shell';
import { ImportClient } from '@/components/import-client';

export const metadata = { title: 'Import — Protech Leads CRM' };

export default async function ImportPage() {
  const session = await getAdmin();
  if (!session) redirect('/login');

  const pipelines = await prisma.pipeline.findMany({ orderBy: { name: 'asc' } });

  return (
    <DashboardShell user={null}>
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Import leads</h1>
          <p className='text-sm text-zinc-400'>
            Paste CSV data (or copy from a spreadsheet) to bulk-add leads into a pipeline.
          </p>
        </div>
        <ImportClient pipelines={pipelines.map((p) => ({ id: p.id, name: p.name }))} />
      </div>
    </DashboardShell>
  );
}
