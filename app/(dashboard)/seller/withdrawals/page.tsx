'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/useAuth'
import { useWalletBalance } from '@/hooks/useWallet'
import { useWithdrawals } from '@/hooks/useWithdrawals'
import { formatTND, formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatusBadge from '@/components/common/StatusBadge'

const TABS = [
  { id: '', label: 'Tous' },
  { id: 'PENDING', label: 'En attente' },
  { id: 'COMPLETED', label: 'Complétés' },
  { id: 'REJECTED', label: 'Rejetés' },
] as const

function methodDetailsDisplay(w: { method: string; methodDetails: Record<string, unknown> }): string {
  const d = w.methodDetails as Record<string, string>
  const phone = d?.phone ?? d?.number
  const iban = d?.iban
  if (w.method.toUpperCase() === 'D17' && phone) return `📱 ${phone}`
  if (iban) return `🏦 ${iban.slice(0, 8)}...`
  return '—'
}

export default function SellerWithdrawalsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useCurrentUser()
  const { data: balanceData } = useWalletBalance()
  const { data: withdrawals = [], isLoading } = useWithdrawals()
  const [tab, setTab] = useState('')

  const balance = balanceData?.balance ?? 0

  useEffect(() => {
    if (authLoading) return
    if (user && user.role !== 'SELLER') router.replace('/dashboard')
  }, [user, authLoading, router])

  const filtered = useMemo(() => {
    if (!tab) return withdrawals
    return withdrawals.filter((w) => w.status === tab)
  }, [withdrawals, tab])

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
        <h1 className="text-2xl font-bold text-white">Mes retraits</h1>
        <Link
          href="/seller/withdrawals/new"
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            balance < 20
              ? 'cursor-not-allowed bg-gray-600 text-gray-400'
              : 'bg-[#6366f1] text-white hover:bg-[#5558e3]'
          }`}
          title={balance < 20 ? 'Solde insuffisant' : undefined}
        >
          + Nouveau retrait
        </Link>
      </div>

      <div className="rounded-xl border border-[#6366f1]/30 bg-[#111111] p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-lg font-semibold text-white">
            Solde disponible: {formatTND(balance)}
          </p>
          {balance >= 20 && (
            <Link
              href="/seller/withdrawals/new"
              className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
            >
              Retirer maintenant
            </Link>
          )}
        </div>
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
          <p className="p-8 text-center text-gray-400">Aucun retrait</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Montant TND</th>
                  <th className="px-4 py-3">Méthode</th>
                  <th className="px-4 py-3">Détails</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w, i) => (
                  <tr key={w.id} className="border-b border-[#1e1e1e] last:border-0">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatDate(w.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#6366f1]">
                      {formatTND(w.amountTnd)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-[#1e1e1e] px-2 py-0.5 text-xs text-gray-400">
                        {w.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {methodDetailsDisplay(w)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={w.status} />
                    </td>
                    <td className="px-4 py-3">
                      {w.status === 'REJECTED' && w.rejectionReason && (
                        <span className="text-xs text-red-400">{w.rejectionReason}</span>
                      )}
                      {w.status === 'COMPLETED' && w.processedAt && (
                        <span className="text-xs text-green-400">
                          Traité le {formatDate(w.processedAt)}
                        </span>
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
