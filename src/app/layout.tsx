import '@/app/globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Protech Leads CRM',
  description: 'Multi-purpose leads pipeline manager'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='min-h-screen bg-zinc-950 text-zinc-100 antialiased'>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          {children}
          <Toaster position='top-right' theme='dark' richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
