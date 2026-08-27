import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const updateLead = z.object({
  name: z.string().min(1).max(200).optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  address: z.string().nullable().optional(),
  locality: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  pincode: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  sourceUrl: z.string().url().nullable().optional(),
  status: z.string().optional(),
  notes: z.string().nullable().optional()
});

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { activities: { orderBy: { createdAt: 'desc' } }, pipeline: true }
  });
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const parsed = updateLead.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = await prisma.lead.update({ where: { id }, data: parsed.data });

  if (parsed.data.status && parsed.data.status !== existing.status) {
    await prisma.activity.create({
      data: {
        leadId: id,
        type: 'status_change',
        content: `Status: ${existing.status} → ${parsed.data.status}`
      }
    });
  }
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
