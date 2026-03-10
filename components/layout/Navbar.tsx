'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Bell } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { useCurrentUser } from '@/hooks/useAuth'
import { useWalletBalance } from '@/hooks/useWallet'
import { formatTND } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const TITLES: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/services': 'Services',
  '/orders': 'Mes commandes',
  '/wallet': 'Wallet',
  '/settings': 'Paramètres',
}

function getPageTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname]
  if (pathname.startsWith('/orders/')) return 'Détail commande'
  if (pathname.startsWith('/services/')) return 'Détail service'
  return 'Tunixo'
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const { user } = useCurrentUser()
  const { data: walletData, isLoading: walletLoading } = useWalletBalance()
  const balance = walletData?.balance ?? 0
  const title = getPageTitle(pathname)

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
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {walletLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <Link
            href="/wallet"
            className="rounded-full bg-[#6366f1]/20 px-3 py-1.5 text-sm font-medium text-[#6366f1] transition-colors hover:bg-[#6366f1]/30"
          >
            {formatTND(balance)}
          </Link>
        )}

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-0 focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]">
            <Avatar className="h-9 w-9 border border-[#1e1e1e]">
              <AvatarFallback className="bg-[#111111] text-sm text-[#6366f1]">
                {(user?.fullName ?? user?.email ?? 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-[#1e1e1e] bg-[#111111]"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => router.push('/settings')}
            >
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => router.push('/wallet')}
            >
              Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
