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
    <main className='grid min-h-screen place-items-center bg-background p-4'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='space-y-1 text-center'>
          <div className='mx-auto grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 font-bold text-white shadow-md shadow-blue-600/25'>
            P
          </div>
          <h1 className='text-xl font-semibold tracking-tight text-foreground'>
            Protech Leads CRM
          </h1>
          <p className='text-sm text-muted-foreground'>Sign in to manage your pipelines</p>
        </div>
        <LoginForm next={sp.next ?? '/dashboard'} initialError={sp.error} />
      </div>
    </main>
  );
}
