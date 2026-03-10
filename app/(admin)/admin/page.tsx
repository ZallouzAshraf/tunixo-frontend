'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  useDashboardStats,
  useAdminOrders,
  usePendingDeposits,
  usePendingWithdrawals,
  useDeliverOrder,
  useConfirmDeposit,
  useRejectDeposit,
  useCompleteWithdrawal,
  useRejectWithdrawal,
} from '@/hooks/useAdmin'
import { formatTND, formatTimeAgo } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import RejectReasonDialog from '@/components/admin/RejectReasonDialog'
import CompleteWithdrawalDialog from '@/components/admin/CompleteWithdrawalDialog'
import { toast } from 'sonner'
import type { Order, SellerDeposit, SellerWithdrawal } from '@/types'

function Copyable({ value, children }: { value: string; children: React.ReactNode }) {
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

function DepositRow({
  deposit,
  onConfirm,
  onReject,
}: {
  deposit: SellerDeposit
  onConfirm: (id: string) => void
  onReject: (id: string) => void
}) {
  const sellerName = deposit.seller?.fullName ?? deposit.seller?.email ?? deposit.sellerId
  return (
    <tr className="border-b border-[#1e1e1e] last:border-0">
      <td className="px-4 py-3">
        <div className="font-medium text-white">{sellerName}</div>
        {deposit.seller?.email && (
          <div className="text-xs text-gray-500">{deposit.seller.email}</div>
        )}
      </td>
      <td className="px-4 py-3 font-medium text-white">${deposit.amountUsd.toFixed(2)}</td>
      <td className="px-4 py-3">
        <span className="rounded bg-gray-500/20 px-2 py-0.5 text-xs text-gray-400">
          {deposit.paymentMethod ?? '—'}
        </span>
      </td>
      <td className="px-4 py-3 text-[#6366f1]">{formatTND(deposit.amountTnd)}</td>
      <td className="px-4 py-3 text-sm text-gray-400">{format(deposit.createdAt, 'dd MMM yyyy', { locale: fr })}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onConfirm(deposit.id)}
            className="rounded bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 hover:bg-green-500/30"
          >
            ✅ Confirmer
          </button>
          <button
            type="button"
            onClick={() => onReject(deposit.id)}
            className="rounded bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/30"
          >
            ❌ Rejeter
          </button>
        </div>
      </td>
    </tr>
  )
}

function WithdrawalRow({
  withdrawal,
  onComplete,
  onReject,
}: {
  withdrawal: SellerWithdrawal
  onComplete: (id: string) => void
  onReject: (id: string) => void
}) {
  const sellerName = withdrawal.seller?.fullName ?? withdrawal.seller?.email ?? withdrawal.sellerId
  const details = withdrawal.methodDetails as Record<string, string> | undefined
  const phone = details?.phone ?? details?.number ?? ''
  const iban = details?.iban ?? ''
  const methodDisplay =
    withdrawal.method.toUpperCase() === 'D17' && phone
      ? `📱 ${phone}`
      : withdrawal.method.toLowerCase().includes('virement') && iban
        ? `🏦 IBAN: ${iban}`
        : JSON.stringify(withdrawal.methodDetails ?? withdrawal.method)

  return (
    <tr className="border-b border-[#1e1e1e] last:border-0">
      <td className="px-4 py-3">
        <div className="font-medium text-white">{sellerName}</div>
        {withdrawal.seller?.email && (
          <div className="text-xs text-gray-500">{withdrawal.seller.email}</div>
        )}
      </td>
      <td className="px-4 py-3 font-medium text-white">{formatTND(withdrawal.amountTnd)}</td>
      <td className="px-4 py-3 text-sm text-gray-400">{withdrawal.method}</td>
      <td className="px-4 py-3 text-sm text-gray-400">{methodDisplay}</td>
      <td className="px-4 py-3 text-sm text-gray-400">{format(withdrawal.createdAt, 'dd MMM yyyy', { locale: fr })}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onComplete(withdrawal.id)}
            className="rounded bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 hover:bg-green-500/30"
          >
            ✅ Complété
          </button>
          <button
            type="button"
            onClick={() => onReject(withdrawal.id)}
            className="rounded bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/30"
          >
            ❌ Rejeter
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminDashboardPage() {
  const [deliverOrderId, setDeliverOrderId] = useState<string | null>(null)
  const [confirmDepositId, setConfirmDepositId] = useState<string | null>(null)
  const [rejectDepositId, setRejectDepositId] = useState<string | null>(null)
  const [completeWithdrawalId, setCompleteWithdrawalId] = useState<string | null>(null)
  const [rejectWithdrawalId, setRejectWithdrawalId] = useState<string | null>(null)

  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({
    status: 'PENDING',
    limit: 50,
  })
  const { data: pendingDeposits = [], isLoading: depositsLoading } = usePendingDeposits()
  const { data: pendingWithdrawals = [], isLoading: withdrawalsLoading } = usePendingWithdrawals()

  const deliverOrder = useDeliverOrder()
  const confirmDeposit = useConfirmDeposit()
  const rejectDeposit = useRejectDeposit()
  const completeWithdrawal = useCompleteWithdrawal()
  const rejectWithdrawal = useRejectWithdrawal()

  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.data ?? []
  const pendingCount = orders.length
  const depositsPendingCount = pendingDeposits.length
  const withdrawalsPendingCount = pendingWithdrawals.length

  const todayLabel = format(new Date(), "EEEE d MMMM yyyy", { locale: fr })

  const handleDeliver = () => {
    if (!deliverOrderId) return
    deliverOrder.mutate(deliverOrderId, {
      onSuccess: () => {
        toast.success('Commande marquée livrée')
        setDeliverOrderId(null)
      },
      onError: () => toast.error('Erreur lors de la livraison'),
    })
  }

  const handleConfirmDeposit = () => {
    if (!confirmDepositId) return
    confirmDeposit.mutate({ id: confirmDepositId }, {
      onSuccess: () => {
        toast.success('Dépôt confirmé')
        setConfirmDepositId(null)
      },
      onError: () => toast.error('Erreur'),
    })
  }

  const handleRejectDeposit = (rejectionReason: string) => {
    if (!rejectDepositId) return
    rejectDeposit.mutate({ id: rejectDepositId, rejectionReason }, {
      onSuccess: () => {
        toast.success('Dépôt rejeté')
        setRejectDepositId(null)
      },
      onError: () => toast.error('Erreur'),
    })
  }

  const handleCompleteWithdrawal = (note?: string) => {
    if (!completeWithdrawalId) return
    completeWithdrawal.mutate({ id: completeWithdrawalId, note }, {
      onSuccess: () => {
        toast.success('Retrait marqué complété')
        setCompleteWithdrawalId(null)
      },
      onError: () => toast.error('Erreur'),
    })
  }

  const handleRejectWithdrawal = (rejectionReason: string) => {
    if (!rejectWithdrawalId) return
    rejectWithdrawal.mutate({ id: rejectWithdrawalId, rejectionReason }, {
      onSuccess: () => {
        toast.success('Retrait rejeté')
        setRejectWithdrawalId(null)
      },
      onError: () => toast.error('Erreur'),
    })
  }

  const withdrawalToComplete = completeWithdrawalId
    ? pendingWithdrawals.find((w) => w.id === completeWithdrawalId)
    : null

  if (statsLoading && !stats) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const s = stats!
  const revenueToday = s.orders?.revenueToday ?? 0
  const revenueThisMonth = s.orders?.revenueThisMonth ?? 0
  const ordersTotal = s.orders?.total ?? 0
  const ordersPending = s.orders?.pending ?? 0
  const usersTotal = s.users?.total ?? 0
  const usersNewToday = s.users?.newToday ?? 0
  const reserveUsd = s.reserve?.currentUsd ?? 0
  const depositsTotalUsd = s.deposits?.totalUsd ?? 0
  const depositsPending = s.deposits?.pending ?? 0
  const depositsConfirmed = s.deposits?.confirmed ?? 0
  const depositsTotal = s.deposits?.total ?? 1
  const withdrawalsTotalTnd = s.withdrawals?.totalTnd ?? 0
  const withdrawalsPending = s.withdrawals?.pending ?? 0
  const servicesActive = s.services?.active ?? 0
  const servicesTotalStock = s.services?.totalStock ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
        <p className="mt-1 text-gray-400">Vue d&apos;ensemble de la plateforme</p>
        <p className="mt-1 text-sm text-gray-500">Aujourd&apos;hui, {todayLabel}</p>
      </div>

      {/* Alert banners */}
      {ordersPending > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <span className="text-red-200">
            🔴 {ordersPending} commandes en attente de livraison
          </span>
          <Link
            href="/admin/orders"
            className="rounded bg-red-500/30 px-3 py-1.5 text-sm font-medium text-red-200 hover:bg-red-500/40"
          >
            Traiter maintenant
          </Link>
        </div>
      )}
      {depositsPendingCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
          <span className="text-yellow-200">
            🟡 {depositsPendingCount} dépôts en attente de validation
          </span>
          <Link
            href="/admin/deposits"
            className="rounded bg-yellow-500/30 px-3 py-1.5 text-sm font-medium text-yellow-200 hover:bg-yellow-500/40"
          >
            Valider
          </Link>
        </div>
      )}
      {withdrawalsPendingCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
          <span className="text-yellow-200">
            🟡 {withdrawalsPendingCount} retraits en attente de traitement
          </span>
          <Link
            href="/admin/withdrawals"
            className="rounded bg-yellow-500/30 px-3 py-1.5 text-sm font-medium text-yellow-200 hover:bg-yellow-500/40"
          >
            Traiter
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <span className="text-2xl">💰</span>
          <p className="mt-2 text-2xl font-bold text-white">{formatTND(revenueToday)}</p>
          <p className="text-sm text-gray-500">Revenus aujourd&apos;hui</p>
          <p className="text-xs text-gray-400">+{formatTND(revenueThisMonth)} ce mois</p>
        </div>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <span className="text-2xl">📦</span>
          <p className="mt-2 text-2xl font-bold text-white">{ordersTotal}</p>
          <p className="text-sm text-gray-500">Commandes totales</p>
          <p className="text-xs text-gray-400">{ordersPending} en attente</p>
        </div>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <span className="text-2xl">👥</span>
          <p className="mt-2 text-2xl font-bold text-white">{usersTotal}</p>
          <p className="text-sm text-gray-500">Utilisateurs</p>
          <p className="text-xs text-gray-400">+{usersNewToday} aujourd&apos;hui</p>
        </div>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <span className="text-2xl">🏦</span>
          <p className="mt-2 text-2xl font-bold text-white">${reserveUsd.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Réserve plateforme</p>
          <p className="text-xs text-gray-400">En USD</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <p className="text-sm text-gray-500">Dépôts</p>
          <p className="text-lg font-bold text-white">${depositsTotalUsd.toFixed(2)} déposés</p>
          <p className="text-xs text-gray-400">{depositsPending} en attente</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1e1e1e]">
            <div
              className="h-full bg-[#6366f1]"
              style={{ width: `${depositsTotal ? (depositsConfirmed / depositsTotal) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <p className="text-sm text-gray-500">Retraits</p>
          <p className="text-lg font-bold text-white">{formatTND(withdrawalsTotalTnd)} retirés</p>
          <p className="text-xs text-gray-400">{withdrawalsPending} en attente</p>
        </div>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <p className="text-sm text-gray-500">Services</p>
          <p className="text-lg font-bold text-white">{servicesActive} services actifs</p>
          <p className="text-xs text-gray-400">{servicesTotalStock} comptes en stock</p>
        </div>
      </div>

      {/* Pending orders */}
      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
        <div className="border-b border-[#1e1e1e] px-4 py-3">
          <h3 className="font-semibold text-white">Commandes en attente ⚡</h3>
          <p className="text-sm text-gray-500">À traiter en priorité</p>
        </div>
        {ordersLoading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <p className="p-6 text-center text-gray-400">✅ Aucune commande en attente</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Email à activer</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: Order, i: number) => (
                  <tr key={order.id} className="border-b border-[#1e1e1e] last:border-0">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">
                        {order.user?.fullName ?? order.user?.email ?? order.userId}
                      </div>
                      {order.user?.email && (
                        <div className="text-xs text-gray-500">{order.user.email}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white">{order.service?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      {order.serviceEmail ? (
                        <Copyable value={order.serviceEmail}>{order.serviceEmail}</Copyable>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-white">{formatTND(order.amountPaid)}</td>
                    <td className="px-4 py-3 text-gray-400">{formatTimeAgo(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setDeliverOrderId(order.id)}
                        className="rounded bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 hover:bg-green-500/30"
                      >
                        ✅ Marquer livré
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending deposits */}
      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
        <div className="border-b border-[#1e1e1e] px-4 py-3">
          <h3 className="font-semibold text-white">Dépôts à valider</h3>
        </div>
        {depositsLoading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : pendingDeposits.length === 0 ? (
          <p className="p-6 text-center text-gray-400">Aucun dépôt en attente</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                  <th className="px-4 py-3">Vendeur</th>
                  <th className="px-4 py-3">Montant USD</th>
                  <th className="px-4 py-3">Méthode</th>
                  <th className="px-4 py-3">TND à créditer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDeposits.map((d) => (
                  <DepositRow
                    key={d.id}
                    deposit={d}
                    onConfirm={setConfirmDepositId}
                    onReject={setRejectDepositId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending withdrawals */}
      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
        <div className="border-b border-[#1e1e1e] px-4 py-3">
          <h3 className="font-semibold text-white">Retraits à traiter</h3>
        </div>
        {withdrawalsLoading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : pendingWithdrawals.length === 0 ? (
          <p className="p-6 text-center text-gray-400">Aucun retrait en attente</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                  <th className="px-4 py-3">Vendeur</th>
                  <th className="px-4 py-3">Montant TND</th>
                  <th className="px-4 py-3">Méthode</th>
                  <th className="px-4 py-3">Détails</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingWithdrawals.map((w) => (
                  <WithdrawalRow
                    key={w.id}
                    withdrawal={w}
                    onComplete={setCompleteWithdrawalId}
                    onReject={setRejectWithdrawalId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deliverOrderId}
        onClose={() => setDeliverOrderId(null)}
        onConfirm={handleDeliver}
        title="Marquer livré"
        description="Confirmez que cette commande a été livrée (email activé)."
        confirmText="Marquer livré"
        isLoading={deliverOrder.isPending}
      />
      <ConfirmDialog
        isOpen={!!confirmDepositId}
        onClose={() => setConfirmDepositId(null)}
        onConfirm={handleConfirmDeposit}
        title="Confirmer ce dépôt"
        description="Le solde du vendeur sera crédité."
        confirmText="Confirmer et créditer"
        isLoading={confirmDeposit.isPending}
      />
      <RejectReasonDialog
        isOpen={!!rejectDepositId}
        onClose={() => setRejectDepositId(null)}
        onConfirm={handleRejectDeposit}
        title="Rejeter ce dépôt"
        description="Indiquez la raison du rejet. Le vendeur en sera informé."
        confirmText="Rejeter"
        isLoading={rejectDeposit.isPending}
      />
      {withdrawalToComplete && (
        <CompleteWithdrawalDialog
          isOpen={!!completeWithdrawalId}
          onClose={() => setCompleteWithdrawalId(null)}
          onConfirm={handleCompleteWithdrawal}
          sellerName={withdrawalToComplete.seller?.fullName ?? withdrawalToComplete.seller?.email ?? withdrawalToComplete.sellerId}
          amountTnd={withdrawalToComplete.amountTnd}
          method={withdrawalToComplete.method}
          isLoading={completeWithdrawal.isPending}
        />
      )}
      <RejectReasonDialog
        isOpen={!!rejectWithdrawalId}
        onClose={() => setRejectWithdrawalId(null)}
        onConfirm={handleRejectWithdrawal}
        title="Rejeter le retrait"
        description="Indiquez la raison. Le vendeur sera remboursé sur son solde."
        confirmText="Rejeter et rembourser"
        isLoading={rejectWithdrawal.isPending}
      />
    </div>
  )
}
