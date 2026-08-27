// Edge-safe auth helpers: no Node-only modules, no Prisma.
export const SESSION_COOKIE_NAME = 'admin_session';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'protech2026';
}

export function checkPassword(input: string): boolean {
  return input === getAdminPassword();
}

// Generate a hex random token using Web Crypto (Edge-safe).
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += bytes[i].toString(16).padStart(2, '0');
  return s;
}
