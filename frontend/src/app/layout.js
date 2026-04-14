import './globals.css';
import { Inter, DM_Sans, Rajdhani, Bebas_Neue } from 'next/font/google';
import { LayoutProvider } from '../context/LayoutContext';
import { Toaster } from 'react-hot-toast';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const rajdhani = Rajdhani({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
});

const bebasNeue = Bebas_Neue({ 
  weight: "400", 
  subsets: ["latin"],
  variable: '--font-bebas',
});

export const metadata = {
  title: 'PC Alley — Integrated Multi-Branch System',
  description: 'Enterprise ERP for IT resource management',
};

import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${rajdhani.variable} ${bebasNeue.variable} font-sans antialiased transition-colors duration-300`}>
        <ThemeProvider>
          <LayoutProvider>
            {children}
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--brand-navy)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderRadius: '16px',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: 'var(--brand-bgbase)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--brand-crimson)',
                    secondary: 'var(--brand-bgbase)',
                  },
                },
              }}
            />
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
