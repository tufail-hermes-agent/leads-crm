'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layers, Settings, LogOut, Activity, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardShell({ children, user }: { children: React.ReactNode; user: unknown }) {
  const pathname = usePathname();
  const router = useRouter();

  const nav = [
    { href: '/dashboard', label: 'Overview', icon: Activity },
    { href: '/dashboard/pipelines', label: 'Pipelines', icon: Layers },
    { href: '/dashboard/import', label: 'Import', icon: Upload },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings }
  ];

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className='min-h-screen'>
      <header className='sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur'>
        <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4'>
          <div className='flex items-center gap-6'>
            <Link href='/dashboard' className='flex items-center gap-2'>
              <span className='grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-orange-500 to-amber-500 text-xs font-bold text-zinc-950'>
                P
              </span>
              <span className='text-sm font-semibold tracking-tight'>Protech Leads CRM</span>
            </Link>
            <nav className='hidden items-center gap-1 md:flex'>
              {nav.map((n) => {
                const active = pathname === n.href || pathname.startsWith(n.href + '/');
                const Icon = n.icon;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition ${
                      active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className='flex items-center gap-2'>
            <Button onClick={logout} variant='ghost' size='sm'>
              <LogOut className='h-4 w-4' />
              <span className='hidden sm:inline'>Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className='mx-auto max-w-7xl px-4 py-6'>{children}</main>
    </div>
  );
}
