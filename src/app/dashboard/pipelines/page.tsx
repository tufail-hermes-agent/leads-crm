import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard-shell';
import { PipelinesToolbar } from '@/components/pipelines-toolbar';
import { Layers } from 'lucide-react';

export const metadata = { title: 'Pipelines — Protech Leads CRM' };

const COLOR_DOT: Record<string, string> = {
  orange: 'bg-orange-500',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  purple: 'bg-violet-500',
  pink: 'bg-pink-500',
  yellow: 'bg-amber-500'
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
            <h1 className='text-2xl font-semibold tracking-tight'>Pipelines</h1>
            <p className='text-sm text-zinc-400'>
              Organize leads by business — gym, transport, anything.
            </p>
          </div>
          <PipelinesToolbar />
        </div>

        {pipelines.length === 0 ? (
          <div className='rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center'>
            <Layers className='mx-auto h-8 w-8 text-zinc-600' />
            <p className='mt-3 text-sm text-zinc-400'>No pipelines yet.</p>
            <p className='text-xs text-zinc-500'>
              Create your first pipeline to start adding leads.
            </p>
            <div className='mt-4 flex justify-center'>
              <PipelinesToolbar />
            </div>
          </div>
        ) : (
          <div className='overflow-hidden rounded-lg border border-zinc-800'>
            <table className='w-full text-sm'>
              <thead className='bg-zinc-900/50 text-left text-xs uppercase tracking-wider text-zinc-400'>
                <tr>
                  <th className='px-4 py-3'>Pipeline</th>
                  <th className='px-4 py-3'>Slug</th>
                  <th className='px-4 py-3'>Leads</th>
                  <th className='px-4 py-3'>Created</th>
                  <th className='px-4 py-3 text-right'>Open</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-800'>
                {pipelines.map((p) => (
                  <tr key={p.id} className='hover:bg-zinc-900/30'>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${COLOR_DOT[p.color] ?? 'bg-zinc-500'}`}
                        />
                        <span className='font-medium'>{p.name}</span>
                      </div>
                      {p.description && (
                        <p className='ml-4 mt-0.5 text-xs text-zinc-500'>{p.description}</p>
                      )}
                    </td>
                    <td className='px-4 py-3 text-zinc-500'>/{p.slug}</td>
                    <td className='px-4 py-3'>{p._count.leads}</td>
                    <td className='px-4 py-3 text-zinc-500'>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-4 py-3 text-right'>
                      <Link
                        className='text-zinc-300 underline-offset-2 hover:underline'
                        href={`/dashboard/pipelines/${p.slug}`}
                      >
                        View leads →
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
