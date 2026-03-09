'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  ShoppingBag,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react'

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/services', label: 'Services', icon: Package },
  { href: '/admin/accounts', label: 'Comptes', icon: CreditCard },
  { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/deposits', label: 'Dépôts', icon: ArrowDownCircle },
  { href: '/admin/withdrawals', label: 'Retraits', icon: ArrowUpCircle },
]

export default function AdminSidebar() {
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
