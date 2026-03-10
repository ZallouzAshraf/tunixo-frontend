'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { useCurrentUser } from '@/hooks/useAuth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import * as auth from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'

const TITLES: Record<string, string> = {
  '/admin': 'Dashboard Admin',
  '/admin/orders': 'Commandes',
  '/admin/deposits': 'Dépôts',
  '/admin/withdrawals': 'Retraits',
  '/admin/users': 'Utilisateurs',
  '/admin/services': 'Services',
  '/admin/accounts': 'Stock',
  '/admin/settings': 'Paramètres',
}

function getPageTitle(pathname: string): string {
  if (pathname in TITLES) return TITLES[pathname]
  if (pathname.startsWith('/admin/users/')) return 'Détail utilisateur'
  if (pathname.startsWith('/admin/services/')) return 'Service'
  return 'Admin'
}

export default function AdminNavbar() {
  const pathname = usePathname()
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const { user } = useCurrentUser()
  const title = getPageTitle(pathname ?? '')

  const handleLogout = () => {
    auth.clearTokens()
    useAuthStore.getState().clearAuth()
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#1e1e1e] bg-[#0a0a0a] px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => toggleSidebar()}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
            Admin Panel
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-0 focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]">
            <Avatar className="h-9 w-9 border border-[#1e1e1e]">
              <AvatarFallback className="bg-[#111111] text-sm text-[#6366f1]">
                {(user?.fullName ?? user?.email ?? 'A').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-[#1e1e1e] bg-[#111111]"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => (window.location.href = '/dashboard')}
            >
              Vue client →
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-400"
              onSelect={handleLogout}
            >
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
