import type { Metadata } from 'next'
import LandingPage from '@/components/landing/LandingPage'

export const metadata: Metadata = {
  title: 'Tunixo — Top-up tes jeux en TND',
  description:
    'Top-up Free Fire, PUBG, Google Play et PlayStation en dinars tunisiens. Paiement sécurisé via Konnect.',
}

export default function HomePage() {
  return <LandingPage />
}
