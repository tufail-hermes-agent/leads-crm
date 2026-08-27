import { LoginForm } from '@/components/login-form';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth-server';

export const metadata = { title: 'Sign in — Protech Leads CRM' };

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const session = await getAdmin();
  if (session) redirect('/dashboard');
  const sp = await searchParams;
  return (
    <main className='grid min-h-screen place-items-center bg-zinc-950 p-4'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='text-center space-y-1'>
          <div className='mx-auto h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 grid place-items-center font-bold text-zinc-950'>
            P
          </div>
          <h1 className='text-xl font-semibold tracking-tight'>Protech Leads CRM</h1>
          <p className='text-sm text-zinc-400'>Sign in to manage your pipelines</p>
        </div>
        <LoginForm next={sp.next ?? '/dashboard'} initialError={sp.error} />
      </div>
    </main>
  );
}
