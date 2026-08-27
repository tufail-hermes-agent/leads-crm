import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';

export default async function Home() {
  const session = await getAdmin();
  if (session) redirect('/dashboard');
  redirect('/login');
}
