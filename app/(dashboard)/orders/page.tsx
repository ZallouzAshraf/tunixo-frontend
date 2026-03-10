'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useOrders } from '@/hooks/useOrders'
import { useCancelOrder } from '@/hooks/useOrders'
import OrderCard from '@/components/orders/OrderCard'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import type { Order } from '@/types'
import { toast } from 'sonner'

const FILTERS = [
  { id: 'all' as const, label: 'Toutes' },
  { id: 'active' as const, label: 'Actives' },
  { id: 'pending' as const, label: 'En attente' },
  { id: 'expired' as const, label: 'Expirées' },
] as const

type FilterId = 'all' | 'active' | 'pending' | 'expired'

function filterOrders(orders: Order[], filter: FilterId): Order[] {
  if (filter === 'all') return orders
  if (filter === 'active') return orders.filter((o) => o.status === 'ACTIVE')
  if (filter === 'pending') return orders.filter((o) => o.status === 'PENDING')
  if (filter === 'expired') return orders.filter((o) => o.status === 'EXPIRED')
  return orders
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)

  const { data: orders = [], isLoading } = useOrders()
  const cancelOrder = useCancelOrder()

  const filtered = useMemo(() => filterOrders(orders, filter), [orders, filter])

  const handleCancelClick = (order: Order) => setCancelTarget(order)
  const handleCancelConfirm = () => {
    if (!cancelTarget) return
    cancelOrder.mutate(cancelTarget.id, {
      onSuccess: () => {
        toast.success(
          `Commande annulée — ${cancelTarget.amountPaid.toFixed(3)} TND remboursé`
        )
        setCancelTarget(null)
        window.location.href = '/orders'
      },
      onError: () => {
        toast.error('Impossible d\'annuler la commande')
      },
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Mes commandes</h1>
        <p className="mt-1 text-gray-400">
          {orders.length} commande{orders.length !== 1 ? 's' : ''} au total
        </p>
      </div>

      <div className="flex gap-1 rounded-lg border border-[#1e1e1e] bg-[#111111] p-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-[#6366f1] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-[#1e1e1e] bg-[#111111] py-16">
          <span className="text-5xl">📦</span>
          <p className="mt-4 font-medium text-white">Aucune commande</p>
          <p className="mt-1 text-center text-sm text-gray-500">
            Vous n&apos;avez pas encore commandé de service
          </p>
          <Link
            href="/services"
            className="mt-4 rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
          >
            Découvrir les services
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={handleCancelClick}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        title="Annuler la commande"
        description="Êtes-vous sûr de vouloir annuler cette commande ? Le montant vous sera remboursé sur votre wallet."
        confirmText="Annuler la commande"
        isLoading={cancelOrder.isPending}
      />
    </div>
  )
}
