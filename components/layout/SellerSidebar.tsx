'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

const items = [
  { href: '/seller', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/deposits', label: 'Dépôts', icon: ArrowDownCircle },
  { href: '/withdrawals', label: 'Retraits', icon: ArrowUpCircle },
]

export default function SellerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 flex-col border-r border-border bg-card">
      <nav className="flex flex-col gap-1 p-4">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
