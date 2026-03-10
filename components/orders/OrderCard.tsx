'use client'

import Link from 'next/link'
import type { Order } from '@/types'
import { formatTND, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/common/StatusBadge'
import { cn } from '@/lib/utils'

function getGradientFromName(name: string): string {
  const hues = [250, 270, 300, 330, 200]
  const index = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length
  const h = hues[index]
  return `linear-gradient(135deg, hsl(${h}, 60%, 25%) 0%, hsl(${h + 30}, 50%, 35%) 100%)`
}

interface OrderCardProps {
  order: Order
  onCancel?: (order: Order) => void
}

export default function OrderCard({ order, onCancel }: OrderCardProps) {
  const serviceName = order.service?.name ?? 'Service'
  const serviceSlug = order.service?.slug ?? ''
  const gradient = getGradientFromName(serviceName)
  const initial = serviceName.charAt(0).toUpperCase()
  const isPending = order.status === 'PENDING'
  const isActive = order.status === 'ACTIVE'
  const isExpired = order.status === 'EXPIRED'

  const borderClass = isPending
    ? 'border-l-yellow-500'
    : isActive
      ? 'border-l-green-500'
      : 'border-l-gray-500'

  return (
    <div
      className={cn(
        'rounded-xl border border-[#1e1e1e] border-l-4 bg-[#111111] p-4',
        borderClass
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <div
            className="h-10 w-10 shrink-0 rounded-lg"
            style={{ background: gradient }}
          >
            <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
              {initial}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white">{serviceName}</span>
              <StatusBadge status={order.status} />
            </div>
            {order.serviceEmail && (
              <p
                className={cn(
                  'mt-1 text-sm',
                  isActive ? 'text-gray-400' : 'text-yellow-500'
                )}
              >
                {isActive
                  ? `Email activé: ${order.serviceEmail}`
                  : `Email en attente: ${order.serviceEmail}`}
              </p>
            )}
            <p className="mt-1 text-sm text-[#6366f1]">
              Montant: {formatTND(order.amountPaid)}
            </p>
            {order.expiresAt && isActive && (
              <p className="mt-0.5 text-xs text-gray-500">
                Expire le: {formatDate(order.expiresAt)}
              </p>
            )}
            <p className="mt-0.5 text-xs text-gray-500">
              Commandé le: {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href={`/orders/${order.id}`}
            className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2 text-sm font-medium text-white hover:bg-[#1e1e1e]"
          >
            Voir détails
          </Link>
          {isPending && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(order)}
              className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              Annuler
            </button>
          )}
          {isExpired && serviceSlug && (
            <Link
              href={`/services/${serviceSlug}`}
              className="rounded-lg bg-[#6366f1] px-3 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
            >
              Renouveler
            </Link>
          )}
        </div>
      </div>

      {isPending && (
        <p className="mt-3 rounded-lg bg-yellow-500/5 px-3 py-2 text-sm text-yellow-200/90">
          ⏳ Votre abonnement est en cours d&apos;activation. Vous recevrez un email
          de confirmation sous 1h.
        </p>
      )}
      {isActive && order.serviceEmail && (
        <p className="mt-3 text-sm text-green-400/90">
          ✅ Abonnement actif sur {order.serviceEmail}
        </p>
      )}
    </div>
  )
}
