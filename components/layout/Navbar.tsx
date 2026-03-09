'use client'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function Navbar() {
  return (
    <header className="border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Tunixo</span>
        <Link href="/" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          Accueil
        </Link>
      </div>
    </header>
  )
}
