'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useCurrentUser, useLogout } from '@/hooks/useAuth'
import { useUiStore } from '@/store/uiStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  Settings,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/services', label: 'Services', icon: Package },
  { href: '/orders', label: 'Mes commandes', icon: ShoppingBag },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/settings', label: 'Paramètres', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useCurrentUser()
  const { logout } = useLogout()
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)

  return (
    <>
      {/* Overlay on mobile when sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden
          onClick={() => useUiStore.getState().setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col border-r border-[#1e1e1e] bg-[#0a0a0a] transition-transform duration-200 md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center border-b border-[#1e1e1e] px-6">
          <Link href="/dashboard" className="text-xl font-bold text-[#6366f1]">
            Tunixo
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg border-l-2 py-2.5 pl-4 pr-3 text-sm transition-all duration-200',
                  isActive
                    ? 'border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]'
                    : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[#1e1e1e] p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <Avatar className="h-9 w-9 border border-[#1e1e1e]">
              <AvatarFallback className="bg-[#6366f1]/20 text-sm text-[#6366f1]">
                {(user?.fullName ?? user?.email ?? 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user?.fullName ?? 'Utilisateur'}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
