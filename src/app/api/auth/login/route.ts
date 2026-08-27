import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, createSession } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({}));
  if (!password || typeof password !== 'string' || !checkPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}
