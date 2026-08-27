import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth-server';

export default async function Home() {
  const session = await getAdmin();
  if (session) redirect('/dashboard');
  redirect('/login');
}
