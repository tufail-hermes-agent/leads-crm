import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard-shell';
import { PipelinesToolbar } from '@/components/pipelines-toolbar';
import { Layers, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Pipelines — Protech Leads CRM' };

const COLOR_DOT: Record<string, string> = {
  orange: 'bg-amber-500',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  purple: 'bg-violet-500',
  pink: 'bg-pink-500',
  yellow: 'bg-yellow-500'
};

export default async function PipelinesPage() {
  const session = await getAdmin();
  if (!session) redirect('/login');

  const pipelines = await prisma.pipeline.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { leads: true } } }
  });

  return (
    <DashboardShell user={null}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight text-foreground'>Pipelines</h1>
            <p className='text-sm text-muted-foreground'>
              Organize leads by business — gym, transport, anything.
            </p>
          </div>
          <PipelinesToolbar />
        </div>

        {pipelines.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center'>
            <div className='mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-50'>
              <Layers className='h-5 w-5 text-blue-600' />
            </div>
            <p className='mt-3 text-sm font-medium text-foreground'>No pipelines yet.</p>
            <p className='text-xs text-muted-foreground'>
              Create your first pipeline to start adding leads.
            </p>
            <div className='mt-4 flex justify-center'>
              <PipelinesToolbar />
            </div>
          </div>
        ) : (
          <div className='overflow-hidden rounded-2xl border border-border bg-card shadow-sm'>
            <table className='w-full text-sm'>
              <thead className='bg-muted/50 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                <tr>
                  <th className='px-5 py-3'>Pipeline</th>
                  <th className='px-5 py-3'>Slug</th>
                  <th className='px-5 py-3'>Leads</th>
                  <th className='px-5 py-3'>Created</th>
                  <th className='px-5 py-3 text-right'>Open</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {pipelines.map((p) => (
                  <tr key={p.id} className='transition-colors hover:bg-muted/40'>
                    <td className='px-5 py-3.5'>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${COLOR_DOT[p.color] ?? 'bg-slate-400'}`}
                        />
                        <span className='font-medium text-foreground'>{p.name}</span>
                      </div>
                      {p.description && (
                        <p className='ml-4.5 mt-0.5 text-xs text-muted-foreground'>
                          {p.description}
                        </p>
                      )}
                    </td>
                    <td className='px-5 py-3.5 text-muted-foreground'>/{p.slug}</td>
                    <td className='px-5 py-3.5 text-foreground'>{p._count.leads}</td>
                    <td className='px-5 py-3.5 text-muted-foreground'>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-5 py-3.5 text-right'>
                      <Link
                        className='inline-flex items-center gap-1 font-medium text-primary hover:underline'
                        href={`/dashboard/pipelines/${p.slug}`}
                      >
                        View leads
                        <ArrowRight className='h-3.5 w-3.5' />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
