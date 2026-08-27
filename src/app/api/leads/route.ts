import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createLead = z.object({
  pipelineId: z.string().min(1),
  name: z.string().min(1).max(200),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  locality: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  sourceUrl: z.string().url().optional().nullable(),
  status: z.string().optional(),
  notes: z.string().optional().nullable(),
  customData: z.record(z.string(), z.unknown()).optional().nullable()
});

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const pipelineId = sp.get('pipelineId');
  const status = sp.get('status');
  const locality = sp.get('locality');
  const search = sp.get('search');
  const limit = Math.min(parseInt(sp.get('limit') || '200', 10), 1000);

  const where: Record<string, unknown> = {};
  if (pipelineId) where.pipelineId = pipelineId;
  if (status) where.status = status;
  if (locality) where.locality = locality;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { locality: { contains: search, mode: 'insensitive' } }
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit
  });
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = createLead.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const lead = await prisma.lead.create({
    data: {
      pipelineId: data.pipelineId,
      name: data.name,
      phone: data.phone ?? null,
      email: data.email ?? null,
      address: data.address ?? null,
      locality: data.locality ?? null,
      city: data.city ?? null,
      pincode: data.pincode ?? null,
      source: data.source ?? null,
      sourceUrl: data.sourceUrl ?? null,
      status: data.status || 'new',
      notes: data.notes ?? null,
      customData: data.customData ? (data.customData as object) : undefined
    }
  });
  await prisma.activity.create({
    data: { leadId: lead.id, type: 'created', content: `Lead created: ${lead.name}` }
  });
  return NextResponse.json(lead, { status: 201 });
}
