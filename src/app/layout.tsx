import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Protech Leads CRM',
  description: 'Multi-purpose leads pipeline manager'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={inter.variable} suppressHydrationWarning>
      <body className='min-h-screen bg-background font-sans text-foreground antialiased'>
        <ThemeProvider attribute='class' forcedTheme='light'>
          {children}
          <Toaster position='top-right' theme='light' richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
