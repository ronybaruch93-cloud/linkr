import type { Metadata } from 'next';
import './globals.css';
import { fontVariables } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'QRGift — Experiencias Digitales Interactivas por Código QR',
  description: 'Crea, personaliza y regala páginas interactivas inolvidables con tarjetas impresas en alta resolución.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={fontVariables}>
      <body className="font-sans selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
