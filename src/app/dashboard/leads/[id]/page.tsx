import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAdmin } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard-shell';
import { LeadDetailClient } from '@/components/lead-detail-client';

export const metadata = { title: 'Lead — Protech Leads CRM' };

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdmin();
  if (!session) redirect('/login');
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { pipeline: true, activities: { orderBy: { createdAt: 'desc' }, take: 50 } }
  });
  if (!lead) notFound();

  return (
    <DashboardShell user={null}>
      <div className='space-y-6'>
        <div>
          <Link
            href={`/dashboard/pipelines/${lead.pipeline.slug}`}
            className='inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300'
          >
            <ArrowLeft className='h-3 w-3' /> Back to {lead.pipeline.name}
          </Link>
        </div>
        <LeadDetailClient
          lead={{
            id: lead.id,
            name: lead.name,
            phone: lead.phone,
            email: lead.email,
            address: lead.address,
            locality: lead.locality,
            city: lead.city,
            pincode: lead.pincode,
            source: lead.source,
            sourceUrl: lead.sourceUrl,
            status: lead.status,
            notes: lead.notes,
            createdAt: lead.createdAt.toISOString()
          }}
          pipelineName={lead.pipeline.name}
          pipelineColor={lead.pipeline.color}
          activities={lead.activities.map((a) => ({
            id: a.id,
            type: a.type,
            content: a.content,
            createdAt: a.createdAt.toISOString()
          }))}
        />
      </div>
    </DashboardShell>
  );
}
