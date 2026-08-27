import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { DashboardShell } from '@/components/dashboard-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = { title: 'Settings — Protech Leads CRM' };

export default async function SettingsPage() {
  const session = await getAdmin();
  if (!session) redirect('/login');
  return (
    <DashboardShell user={null}>
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Settings</h1>
          <p className='text-sm text-zinc-400'>Application configuration.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Authentication</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2 text-sm text-zinc-400'>
            <p>
              The admin password is set via the{' '}
              <code className='rounded bg-zinc-800 px-1.5 py-0.5 text-xs'>ADMIN_PASSWORD</code>{' '}
              environment variable on Vercel. Update it in your Vercel project settings, then
              redeploy.
            </p>
            <p>
              Default password:{' '}
              <code className='rounded bg-zinc-800 px-1.5 py-0.5 text-xs'>protech2026</code>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>About</CardTitle>
          </CardHeader>
          <CardContent className='space-y-1 text-sm text-zinc-400'>
            <p>Protech Leads CRM — multi-purpose leads pipeline manager.</p>
            <p>Stack: Next.js 16 · Prisma · PostgreSQL (Neon) · shadcn/ui · Tailwind v4.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
