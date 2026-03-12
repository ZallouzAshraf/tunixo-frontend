'use client'

import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/products': 'Top-up & Recharges',
  '/orders': 'Mes commandes',
  '/wallet': 'Mon Wallet',
  '/settings': 'Paramètres',
  '/admin': 'Dashboard Admin',
  '/admin/orders': 'Commandes',
  '/admin/users': 'Utilisateurs',
  '/admin/products': 'Produits',
  '/admin/giftcodes': 'Codes cadeaux',
  '/admin/stats': 'Statistiques',
  '/admin/settings': 'Paramètres',
}

export function usePageTitle(): string {
  const pathname = usePathname()
  if (pathname && titles[pathname]) return titles[pathname]
  if (pathname?.startsWith('/orders/')) return 'Détail commande'
  if (pathname?.startsWith('/admin/users/')) return 'Détail utilisateur'
  return 'Tunixo'
}
