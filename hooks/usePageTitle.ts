'use client'

import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/services': 'Services',
  '/orders': 'Mes commandes',
  '/wallet': 'Mon Wallet',
  '/settings': 'Paramètres',
  '/seller': 'Espace Vendeur',
  '/seller/deposits': 'Mes dépôts',
  '/seller/deposits/new': 'Nouveau dépôt',
  '/seller/withdrawals': 'Mes retraits',
  '/seller/withdrawals/new': 'Nouveau retrait',
  '/admin': 'Dashboard Admin',
  '/admin/orders': 'Commandes',
  '/admin/deposits': 'Dépôts',
  '/admin/withdrawals': 'Retraits',
  '/admin/users': 'Utilisateurs',
  '/admin/services': 'Services',
  '/admin/accounts': 'Stock',
  '/admin/settings': 'Paramètres',
}

export function usePageTitle(): string {
  const pathname = usePathname()
  if (pathname && titles[pathname]) return titles[pathname]
  if (pathname?.startsWith('/orders/')) return 'Détail commande'
  if (pathname?.startsWith('/services/')) return 'Détail service'
  if (pathname?.startsWith('/admin/users/')) return 'Détail utilisateur'
  if (pathname?.startsWith('/admin/services/')) return 'Service'
  return 'Tunixo'
}
