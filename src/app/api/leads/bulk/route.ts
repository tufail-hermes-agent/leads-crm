import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bulk = z.object({
  action: z.enum(['status', 'delete', 'import']),
  ids: z.array(z.string()).optional(),
  status: z.string().optional(),
  leads: z
    .array(
      z.object({
        pipelineId: z.string().min(1),
        name: z.string().min(1),
        phone: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
        address: z.string().nullable().optional(),
        locality: z.string().nullable().optional(),
        city: z.string().nullable().optional(),
        pincode: z.string().nullable().optional(),
        source: z.string().nullable().optional(),
        sourceUrl: z.string().nullable().optional(),
        status: z.string().optional(),
        notes: z.string().nullable().optional()
      })
    )
    .optional()
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = bulk.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { action, ids, status, leads } = parsed.data;

  if (action === 'status') {
    if (!ids?.length || !status) {
      return NextResponse.json({ error: 'ids and status required' }, { status: 400 });
    }
    const result = await prisma.lead.updateMany({ where: { id: { in: ids } }, data: { status } });
    await prisma.activity.createMany({
      data: ids.map((leadId) => ({
        leadId,
        type: 'status_change',
        content: `Bulk status → ${status}`
      }))
    });
    return NextResponse.json({ ok: true, count: result.count });
  }

  if (action === 'delete') {
    if (!ids?.length) return NextResponse.json({ error: 'ids required' }, { status: 400 });
    const result = await prisma.lead.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ ok: true, count: result.count });
  }

  if (action === 'import') {
    if (!leads?.length) return NextResponse.json({ error: 'leads required' }, { status: 400 });
    const pipelineIds = Array.from(new Set(leads.map((l) => l.pipelineId)));
    const existingPipelines = await prisma.pipeline.findMany({
      where: { id: { in: pipelineIds } },
      select: { id: true }
    });
    const validIds = new Set(existingPipelines.map((p) => p.id));
    const filtered = leads.filter((l) => validIds.has(l.pipelineId));

    const created = await prisma.$transaction(
      filtered.map((l) =>
        prisma.lead.create({
          data: {
            pipelineId: l.pipelineId,
            name: l.name,
            phone: l.phone ?? null,
            email: l.email ?? null,
            address: l.address ?? null,
            locality: l.locality ?? null,
            city: l.city ?? null,
            pincode: l.pincode ?? null,
            source: l.source ?? 'Bulk import',
            sourceUrl: l.sourceUrl ?? null,
            status: l.status || 'new',
            notes: l.notes ?? null
          }
        })
      )
    );
    return NextResponse.json({
      ok: true,
      count: created.length,
      skipped: leads.length - created.length
    });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
