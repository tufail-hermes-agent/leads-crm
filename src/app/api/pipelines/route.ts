import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, digits, hyphens only'),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional()
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function GET() {
  const pipelines = await prisma.pipeline.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { leads: true } } }
  });
  return NextResponse.json(pipelines);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const slug = data.slug || slugify(data.name);
  try {
    const created = await prisma.pipeline.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        color: data.color || 'blue',
        icon: data.icon
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Create failed';
    if (msg.includes('Unique')) {
      return NextResponse.json(
        { error: 'A pipeline with that name/slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
