import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { SESSION_COOKIE_NAME, generateSessionToken } from './auth-edge';

const SESSION_DAYS = 30;

export async function getAdmin() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({ where: { token } });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session;
}

export async function createSession(): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.adminSession.create({ data: { token, expiresAt } });
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/'
  });
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await prisma.adminSession.delete({ where: { token } }).catch(() => {});
  }
  jar.delete(SESSION_COOKIE_NAME);
}

export { SESSION_COOKIE_NAME, getAdminPassword, checkPassword } from './auth-edge';
