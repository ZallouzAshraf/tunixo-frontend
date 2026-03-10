import type { Metadata } from 'next'
import LandingPage from '@/components/landing/LandingPage'

export const metadata: Metadata = {
  title: 'Tunixo — Accède au digital mondial, paie en TND',
  description:
    'Tunixo est la première marketplace tunisienne pour accéder aux abonnements digitaux mondiaux (Cursor, ChatGPT, Adobe) en payant en TND local.',
}

export default function HomePage() {
  return <LandingPage />
}
