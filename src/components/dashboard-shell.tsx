'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layers, Settings, LogOut, Activity, Upload } from 'lucide-react';
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
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-30 border-b border-border bg-white/80 backdrop-blur-md'>
        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6'>
          <div className='flex items-center gap-8'>
            <Link href='/dashboard' className='flex items-center gap-2.5'>
              <span className='grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-bold text-white shadow-sm shadow-blue-600/30'>
                P
              </span>
              <span className='text-sm font-semibold tracking-tight text-foreground'>
                Protech Leads CRM
              </span>
            </Link>
            <nav className='hidden items-center gap-1 md:flex'>
              {nav.map((n) => {
                const active = pathname === n.href || pathname.startsWith(n.href + '/');
                const Icon = n.icon;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className='flex items-center gap-3'>
            <span className='hidden h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 sm:grid'>
              A
            </span>
            <Button onClick={logout} variant='outline' size='sm'>
              <LogOut className='h-4 w-4' />
              <span className='hidden sm:inline'>Logout</span>
            </Button>
          </div>
        </div>
        <nav className='flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden'>
          {nav.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + '/');
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className='h-4 w-4' />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8'>{children}</main>
    </div>
  );
}
