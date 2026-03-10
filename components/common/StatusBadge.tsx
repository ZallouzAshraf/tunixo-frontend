'use client'

import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: 'Actif',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  CONFIRMED: {
    label: 'Confirmé',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  COMPLETED: {
    label: 'Terminé',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  PENDING: {
    label: 'En attente',
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  },
  FAILED: {
    label: 'Échoué',
    className: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
  REJECTED: {
    label: 'Refusé',
    className: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
  EXPIRED: {
    label: 'Expiré',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  },
  REFUNDED: {
    label: 'Remboursé',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  },
  USED: {
    label: 'Utilisé',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  },
  PROCESSING: {
    label: 'En cours',
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  },
}

export default function StatusBadge({ status }: { status: string }) {
  const upper = status?.toUpperCase() ?? ''
  const config = STATUS_CONFIG[upper] ?? {
    label: upper || '—',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 rounded-full text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
