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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Lemon - Furniture Design and Manufacturing",
  description: "We design and manufacture high-quality furniture. Specialists in custom furniture, interior design, and tailored solutions.",
  keywords: 'furniture, interior design, furniture manufacturing, custom furniture, furniture design',
  authors: [{ name: 'Lemon', url: 'mailto:lemonsimplify@gmail.com' }],
  metadataBase: new URL('https://lemonutah.com'),
  openGraph: {
    title: 'Lemon - Furniture Design and Manufacturing',
    description: 'We design and manufacture high-quality furniture. Specialists in custom furniture, interior design, and tailored solutions.',
    url: 'https://lemonutah.com',
    siteName: 'Lemon',
    images: [
      {
        url: '/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Lemon - Furniture Design and Manufacturing',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lemon - Furniture Design and Manufacturing',
    description: 'We design and manufacture high-quality furniture. Specialists in custom furniture.',
    images: ['/thumbnail.png'],
    creator: '@lemon',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ]
  },
  manifest: '/site.webmanifest',
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
        <link rel="canonical" href="https://lemonutah.com" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        {/* Metaetiquetas generales para previsualizaciones */}
        <meta property="image" content="/thumbnail.png" />
        <meta name="image" content="/thumbnail.png" />
        <meta itemProp="image" content="/thumbnail.png" />
        {/* Schema.org para Google */}
        <meta itemProp="name" content="Lemon - Furniture Design and Manufacturing" />
        <meta itemProp="description" content="We design and manufacture high-quality furniture. Specialists in custom furniture, interior design, and tailored solutions." />
        {/* WhatsApp y otras apps de mensajería */}
        <meta property="og:image:secure_url" content="/thumbnail.png" />
        <meta property="og:image:type" content="image/png" />
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
