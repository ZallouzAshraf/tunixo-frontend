'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDashboardStats } from '@/hooks/useAdmin'
import { formatTND } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading && !stats) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const s = stats!
  const todayLabel = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
        <p className="mt-1 text-gray-400">Vue d&apos;ensemble de la plateforme</p>
        <p className="mt-1 text-sm text-gray-500">Aujourd&apos;hui, {todayLabel}</p>
      </div>

      {s.pendingOrders > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
          <span className="text-yellow-200">
            🟡 {s.pendingOrders} commandes en cours
          </span>
          <Link
            href="/admin/orders"
            className="rounded bg-yellow-500/30 px-3 py-1.5 text-sm font-medium text-yellow-200 hover:bg-yellow-500/40"
          >
            Voir
          </Link>
        </div>
      )}

      {s.stockAlerts && s.stockAlerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">⚠️ Stock faible</h3>
          <div className="flex flex-wrap gap-2">
            {s.stockAlerts.map((alert) => (
              <div
                key={alert.productName}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              >
                {alert.productName} — {alert.available} codes restants
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <span className="text-2xl">👥</span>
          <p className="mt-2 text-2xl font-bold text-white">{s.totalUsers}</p>
          <p className="text-sm text-gray-500">Utilisateurs</p>
        </div>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <span className="text-2xl">📦</span>
          <p className="mt-2 text-2xl font-bold text-white">{s.totalOrders}</p>
          <p className="text-sm text-gray-500">Commandes totales</p>
          <p className="text-xs text-gray-400">
            {s.completedOrders} complétées · {s.failedOrders} échouées
          </p>
        </div>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <span className="text-2xl">💰</span>
          <p className="mt-2 text-2xl font-bold text-white">
            {formatTND(s.todayRevenue)}
          </p>
          <p className="text-sm text-gray-500">Revenus aujourd&apos;hui</p>
          <p className="text-xs text-gray-400">{s.todayOrders} commandes</p>
        </div>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <span className="text-2xl">📈</span>
          <p className="mt-2 text-2xl font-bold text-white">
            {formatTND(s.totalRevenueTnd)}
          </p>
          <p className="text-sm text-gray-500">Revenus totaux (TND)</p>
        </div>
      </div>
    </div>
  )
}
