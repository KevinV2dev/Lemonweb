import type { Metadata } from "next";
import MainLayout from '@/app/components/layouts/MainLayout'
import "./globals.css";
import { Saira } from 'next/font/google';

const saira = Saira({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "LemonIUTA",
  description: "Descripción de LemonIUTA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={saira.className}>
      <body className="antialiased">
      <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
