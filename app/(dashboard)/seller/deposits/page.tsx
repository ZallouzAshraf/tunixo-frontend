'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/useAuth'
import { useDeposits } from '@/hooks/useDeposits'
import { formatTND, formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatusBadge from '@/components/common/StatusBadge'

const TABS = [
  { id: '', label: 'Tous' },
  { id: 'PENDING', label: 'En attente' },
  { id: 'CONFIRMED', label: 'Confirmés' },
  { id: 'REJECTED', label: 'Rejetés' },
] as const

const METHOD_LABELS: Record<string, string> = {
  PAYPAL: 'PayPal',
  FIVERR: 'Fiverr',
  UPWORK: 'Upwork',
  WISE: 'Wise',
  OTHER: 'Autre',
}

export default function SellerDepositsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useCurrentUser()
  const { data: deposits = [], isLoading } = useDeposits()
  const [tab, setTab] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (user && user.role !== 'SELLER') router.replace('/dashboard')
  }, [user, authLoading, router])

  const filtered = useMemo(() => {
    if (!tab) return deposits
    return deposits.filter((d) => d.status === tab)
  }, [deposits, tab])

  const totalUsd = deposits.reduce((s, d) => s + d.amountUsd, 0)
  const totalTnd = deposits
    .filter((d) => d.status === 'CONFIRMED' || d.status === 'USED')
    .reduce((s, d) => s + d.amountTnd, 0)
  const pendingCount = deposits.filter((d) => d.status === 'PENDING').length

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  if (!user || user.role !== 'SELLER') return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Mes dépôts</h1>
        <Link
          href="/seller/deposits/new"
          className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
        >
          + Nouveau dépôt
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <span>Total déposé: ${totalUsd.toFixed(2)}</span>
        <span>Total crédité: {formatTND(totalTnd)}</span>
        <span>En attente: {pendingCount}</span>
      </div>

      <div className="flex gap-2 rounded-lg border border-[#1e1e1e] bg-[#111111] p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-[#6366f1] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <p className="font-medium text-white">Aucun dépôt</p>
            <Link
              href="/seller/deposits/new"
              className="mt-4 rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
            >
              Soumettre votre premier dépôt
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Montant USD</th>
                  <th className="px-4 py-3">TND crédité</th>
                  <th className="px-4 py-3">Méthode</th>
                  <th className="px-4 py-3">Preuve</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Note rejet</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={d.id} className="border-b border-[#1e1e1e] last:border-0">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatDate(d.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      ${d.amountUsd.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-[#6366f1]">
                      {d.status === 'PENDING' ? '0.000 TND' : formatTND(d.amountTnd)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-[#1e1e1e] px-2 py-0.5 text-xs text-gray-400">
                        {METHOD_LABELS[d.paymentMethod ?? ''] ?? d.paymentMethod ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {d.proofUrl ? (
                        <a
                          href={d.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6366f1] hover:underline"
                        >
                          Voir preuve 🔗
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3">
                      {d.status === 'REJECTED' && d.rejectionReason && (
                        <span className="text-xs text-red-400">{d.rejectionReason}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
