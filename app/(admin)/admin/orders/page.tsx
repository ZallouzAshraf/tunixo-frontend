'use client'

import { useState, useMemo } from 'react'
import {
  useAdminOrders,
  useRetryOrder,
} from '@/hooks/useAdmin'
import { formatTND, formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatusBadge from '@/components/common/StatusBadge'
import { toast } from 'sonner'
import type { Order } from '@/types'

const FILTERS = [
  { id: '', label: 'Toutes' },
  { id: 'PENDING', label: 'En attente' },
  { id: 'PROCESSING', label: 'En cours' },
  { id: 'COMPLETED', label: 'Complétées' },
  { id: 'FAILED', label: 'Échouées' },
] as const

const LIMIT = 20

function Copyable({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) {
  const copy = () => {
    navigator.clipboard.writeText(value)
    toast.success('Copié')
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="text-left font-medium text-[#6366f1] hover:underline"
    >
      {children}
    </button>
  )
}

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showCodeOrderId, setShowCodeOrderId] = useState<string | null>(null)

  const { data, isLoading } = useAdminOrders({
    status: statusFilter || undefined,
    page,
    limit: LIMIT,
    search: search.trim() || undefined,
  })
  const retryOrder = useRetryOrder()

  const paginated = data && !Array.isArray(data) ? data : null
  const orders: Order[] = paginated?.data ?? (Array.isArray(data) ? data : [])
  const total = paginated?.total ?? orders.length
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders
    const q = search.trim().toLowerCase()
    return orders.filter(
      (o) =>
        o.user?.email?.toLowerCase().includes(q) ||
        o.user?.fullName?.toLowerCase().includes(q) ||
        o.product?.name?.toLowerCase().includes(q),
    )
  }, [orders, search])

  const handleRetry = (orderId: string) => {
    retryOrder.mutate(orderId, {
      onSuccess: (data: { success: boolean; message?: string }) => {
        if (data.success) {
          toast.success('Retry envoyé')
        } else {
          toast.error(data.message ?? 'Échec du retry')
        }
      },
      onError: () => toast.error('Erreur'),
    })
  }

  const orderWithCode = showCodeOrderId
    ? orders.find((o) => o.id === showCodeOrderId)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Toutes les commandes</h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 rounded-lg border border-[#1e1e1e] bg-[#111111] p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setStatusFilter(f.id)
                setPage(1)
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                statusFilter === f.id
                  ? 'bg-[#6366f1] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Rechercher (email, produit...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-lg border border-[#1e1e1e] bg-[#111111] px-4 text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none sm:w-64"
        />
      </div>

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Produit</th>
                    <th className="px-4 py-3">Player ID / Code</th>
                    <th className="px-4 py-3">Montant</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, i) => (
                    <tr
                      key={order.id}
                      className={`border-b border-[#1e1e1e] last:border-0 ${
                        order.status === 'PENDING' ? 'bg-yellow-500/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-400">
                        {(page - 1) * LIMIT + i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">
                          {order.user?.fullName ??
                            order.user?.email ??
                            order.userId}
                        </div>
                        {order.user?.email && (
                          <div className="text-xs text-gray-500">
                            {order.user.email}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {order.product?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        {order.playerId ? (
                          <span className="text-gray-400">
                            {order.playerId}
                          </span>
                        ) : order.status === 'COMPLETED' &&
                          order.product?.serviceType === 'GIFTCARD' &&
                          order.deliveredCode ? (
                          <button
                            type="button"
                            onClick={() => setShowCodeOrderId(order.id)}
                            className="text-[#6366f1] hover:underline"
                          >
                            🎁 Voir code
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {formatTND(order.amountPaid)} TND
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {order.status === 'FAILED' &&
                          order.product?.serviceType === 'TOPUP' && (
                            <button
                              type="button"
                              onClick={() => handleRetry(order.id)}
                              disabled={retryOrder.isPending}
                              className="rounded bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/30 disabled:opacity-50"
                            >
                              🔄 Retry
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOrders.length === 0 && (
              <p className="p-8 text-center text-gray-400">Aucune commande</p>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#1e1e1e] px-4 py-3">
                <p className="text-sm text-gray-500">
                  Page {page} / {totalPages} ({total} commandes)
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-1.5 text-sm text-white disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-1.5 text-sm text-white disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {orderWithCode?.deliveredCode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCodeOrderId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-gray-500">Code livré</p>
            <p className="mt-2 text-xl font-bold tracking-widest text-white">
              {orderWithCode.deliveredCode}
            </p>
            <button
              type="button"
              onClick={() => setShowCodeOrderId(null)}
              className="mt-4 rounded-lg bg-[#6366f1] px-4 py-2 text-sm text-white"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
