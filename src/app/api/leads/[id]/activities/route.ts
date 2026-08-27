import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const addActivity = z.object({
  type: z.enum(['note', 'call', 'email', 'meeting']),
  content: z.string().min(1).max(2000)
});

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const parsed = addActivity.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const lead = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  const activity = await prisma.activity.create({
    data: { leadId: id, type: parsed.data.type, content: parsed.data.content }
  });
  return NextResponse.json(activity, { status: 201 });
}
