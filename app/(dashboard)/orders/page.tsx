'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useOrders } from '@/hooks/useOrders'
import OrderCard from '@/components/orders/OrderCard'
import OrderCardSkeleton from '@/components/skeletons/OrderCardSkeleton'
import EmptyState from '@/components/common/EmptyState'
import { fadeIn, staggerContainer, staggerItem } from '@/lib/animations'
import type { Order } from '@/types'

const FILTERS = [
  { id: 'all' as const, label: 'Toutes' },
  { id: 'completed' as const, label: 'Complétées' },
  { id: 'processing' as const, label: 'En cours' },
  { id: 'failed' as const, label: 'Échouées' },
] as const

type FilterId = 'all' | 'completed' | 'processing' | 'failed'

function filterOrders(orders: Order[], filter: FilterId): Order[] {
  if (filter === 'all') return orders
  if (filter === 'completed') return orders.filter((o) => o.status === 'COMPLETED')
  if (filter === 'processing') {
    return orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING')
  }
  if (filter === 'failed') return orders.filter((o) => o.status === 'FAILED')
  return orders
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<FilterId>('all')

  const { data: orders = [], isLoading } = useOrders()
  const filtered = useMemo(() => filterOrders(orders, filter), [orders, filter])

  return (
    <motion.div
      className="space-y-8"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
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
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Aucune commande"
          description="Vous n'avez pas encore commandé."
          action={{ label: 'Découvrir les produits', href: '/products' }}
        />
      ) : (
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {filtered.map((order) => (
            <motion.div key={order.id} variants={staggerItem}>
              <OrderCard order={order} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
