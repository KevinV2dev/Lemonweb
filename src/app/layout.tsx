import type { Metadata } from "next";
import MainLayout from '@/app/components/layouts/MainLayout'
import "./globals.css";
import { Saira } from 'next/font/google';
import { Providers } from './providers/providers'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const saira = Saira({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Lemon - Diseño y Fabricación de Muebles",
  description: "Diseñamos y fabricamos muebles de alta calidad. Especialistas en mobiliario personalizado, diseño de interiores y soluciones a medida.",
  keywords: 'muebles, diseño de interiores, fabricación de muebles, muebles personalizados, diseño de muebles',
  authors: [{ name: 'Lemon' }],
  metadataBase: new URL('https://lemon.com'),
  openGraph: {
    title: 'Lemon - Diseño y Fabricación de Muebles',
    description: 'Diseñamos y fabricamos muebles de alta calidad. Especialistas en mobiliario personalizado, diseño de interiores y soluciones a medida.',
    url: 'https://lemon.com',
    siteName: 'Lemon',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lemon - Diseño y Fabricación de Muebles',
      }
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lemon - Diseño y Fabricación de Muebles',
    description: 'Diseñamos y fabricamos muebles de alta calidad. Especialistas en mobiliario personalizado.',
    images: ['/twitter-image.jpg'],
    creator: '@lemon',
  },
  icons: {
    icon: [
      { url: '/icon.svg' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000'
      }
    ]
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'google-site-verification-code',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={saira.className}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__env = ${JSON.stringify({
              NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
              NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            })}`,
          }}
        />
        <link rel="canonical" href="https://lemon.com" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className="antialiased">
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
