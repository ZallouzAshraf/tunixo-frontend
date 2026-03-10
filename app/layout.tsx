import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryProvider } from '@/providers/QueryProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://tunixo.tn'),

  title: {
    default: 'Tunixo — Accède au digital mondial, paie en TND',
    template: '%s | Tunixo',
  },

  description:
    'Tunixo est la première marketplace tunisienne pour accéder aux abonnements digitaux mondiaux (Cursor, ChatGPT, Adobe) en payant en TND local.',

  keywords: [
    'tunixo',
    'abonnements digitaux tunisie',
    'cursor pro tunisie',
    'chatgpt tunisie',
    'payer en TND',
    'marketplace digitale tunisie',
    'freelance tunisie',
    'devises tunisie',
  ],

  authors: [{ name: 'Tunixo', url: 'https://tunixo.tn' }],
  creator: 'Tunixo',
  publisher: 'Tunixo',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    url: 'https://tunixo.tn',
    siteName: 'Tunixo',
    title: 'Tunixo — Accède au digital mondial, paie en TND',
    description:
      'La première marketplace tunisienne pour les abonnements digitaux. Paiement en TND via D17.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tunixo — Marketplace digitale tunisienne',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Tunixo — Accède au digital mondial, paie en TND',
    description: 'Abonnements digitaux payables en TND en Tunisie.',
    images: ['/og-image.png'],
    creator: '@tunixo_tn',
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',

  alternates: {
    canonical: 'https://tunixo.tn',
    languages: {
      'fr-TN': 'https://tunixo.tn',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
