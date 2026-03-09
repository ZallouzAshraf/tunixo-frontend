'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Lock, CreditCard, ShoppingCart } from 'lucide-react'

const LOGIN_BULLETS = [
  { icon: Zap, text: 'Livraison instantanée' },
  { icon: Lock, text: 'Paiement 100% sécurisé' },
  { icon: CreditCard, text: 'Fait pour les Tunisiens' },
] as const

const REGISTER_BULLETS = [
  { icon: ShoppingCart, text: '20+ services disponibles' },
  { icon: CreditCard, text: 'Paiement en TND local' },
  { icon: Zap, text: "Accès en moins d'une heure" },
] as const

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'
  const bullets = isLogin ? LOGIN_BULLETS : REGISTER_BULLETS

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row">
      {/* Left panel — desktop only */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center px-10 lg:px-16 py-12 bg-gradient-to-br from-[#6366f1]/20 via-[#0a0a0a] to-[#0a0a0a] border-r border-[#222222]">
        <Link href="/" className="text-2xl font-bold text-[#6366f1]">
          Tunixo
        </Link>
        <p className="mt-2 text-gray-400 text-sm max-w-xs">
          Accède au digital mondial, paie en TND
        </p>
        <ul className="mt-10 space-y-4">
          {bullets.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-gray-300">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6366f1]/20 text-[#6366f1]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: form area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
