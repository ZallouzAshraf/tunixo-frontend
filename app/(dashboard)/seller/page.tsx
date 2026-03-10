'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/useAuth'
import { useWalletBalance } from '@/hooks/useWallet'
import { useDeposits } from '@/hooks/useDeposits'
import { useWithdrawals } from '@/hooks/useWithdrawals'
import { formatTND, formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatusBadge from '@/components/common/StatusBadge'

export default function SellerDashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useCurrentUser()
  const { data: balanceData, isLoading: balanceLoading } = useWalletBalance()
  const { data: deposits = [], isLoading: depositsLoading } = useDeposits()
  const { data: withdrawals = [], isLoading: withdrawalsLoading } = useWithdrawals()

  useEffect(() => {
    if (authLoading) return
    if (user && user.role !== 'SELLER') {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

  if (authLoading || (user && user.role !== 'SELLER' && !authLoading)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) return null

  const balance = balanceData?.balance ?? 0
  const totalUsd = deposits.reduce((s, d) => s + d.amountUsd, 0)
  const totalTndEarned = deposits
    .filter((d) => d.status === 'CONFIRMED' || d.status === 'USED')
    .reduce((s, d) => s + d.amountTnd, 0)
  const confirmedCount = deposits.filter((d) => d.status === 'CONFIRMED' || d.status === 'USED').length
  const pendingCount = deposits.filter((d) => d.status === 'PENDING').length
  const recentDeposits = deposits.slice(0, 5)
  const recentWithdrawals = withdrawals.slice(0, 5)
  const hasDeposits = deposits.length > 0
  const isLoading = balanceLoading || depositsLoading || withdrawalsLoading

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Espace Vendeur</h1>
          <p className="mt-1 text-gray-400">Gérez vos dépôts et retraits</p>
        </div>
        <span className="rounded-full bg-[#6366f1]/20 px-3 py-1 text-sm font-medium text-[#6366f1]">
          Vendeur
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
              <span className="text-2xl">💳</span>
              <p className="mt-2 text-2xl font-bold text-[#6366f1]">{formatTND(balance)}</p>
              <p className="text-sm text-gray-500">Solde disponible</p>
              <Link
                href="/seller/withdrawals/new"
                className="mt-2 inline-block text-sm font-medium text-[#6366f1] hover:underline"
              >
                Retirer
              </Link>
            </div>
            <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
              <span className="text-2xl">💰</span>
              <p className="mt-2 text-2xl font-bold text-white">${totalUsd.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Total déposé (USD)</p>
              <p className="text-xs text-gray-400">{confirmedCount} dépôts confirmés</p>
            </div>
            <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
              <span className="text-2xl">📈</span>
              <p className="mt-2 text-2xl font-bold text-white">{formatTND(totalTndEarned)}</p>
              <p className="text-sm text-gray-500">Total gagné (TND)</p>
              <p className="text-xs text-gray-400">Après commission plateforme</p>
            </div>
            <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
              <span className="text-2xl">⏳</span>
              <p className="mt-2 text-2xl font-bold text-yellow-400">{pendingCount}</p>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-xs text-gray-400">Dépôts non confirmés</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/seller/deposits/new"
              className="flex items-center gap-4 rounded-xl border border-[#1e1e1e] bg-[#111111] p-6 transition-colors hover:border-[#6366f1]/30"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#6366f1]/20 text-2xl">
                💵
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">Soumettre un dépôt</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Déposez vos revenus PayPal/Fiverr et recevez des TND
                </p>
              </div>
              <span className="text-2xl text-gray-500">→</span>
            </Link>
            <Link
              href="/seller/withdrawals/new"
              className="flex items-center gap-4 rounded-xl border border-[#1e1e1e] bg-[#111111] p-6 transition-colors hover:border-[#6366f1]/30"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#6366f1]/20 text-2xl">
                🏦
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">Retirer mes TND</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Transférez votre solde vers D17 ou votre compte bancaire
                </p>
              </div>
              <span className="text-2xl text-gray-500">→</span>
            </Link>
          </div>

          {!hasDeposits && (
            <div className="rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/5 p-6">
              <h3 className="font-semibold text-white">Comment ça marche</h3>
              <ol className="mt-4 space-y-3 text-sm text-gray-300">
                <li className="flex gap-3">
                  <span className="font-bold text-[#6366f1]">1.</span>
                  <div>
                    <strong>Soumettez un dépôt</strong> — Indiquez le montant en USD disponible sur
                    PayPal/Fiverr
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#6366f1]">2.</span>
                  <div>
                    <strong>Notre équipe valide</strong> — Nous vérifions votre preuve de paiement
                    sous 24h
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#6366f1]">3.</span>
                  <div>
                    <strong>Votre wallet est crédité</strong> — Recevez vos TND directement sur
                    votre wallet Tunixo
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#6366f1]">4.</span>
                  <div>
                    <strong>Retirez quand vous voulez</strong> — Via D17 ou virement bancaire
                  </div>
                </li>
              </ol>
            </div>
          )}

          <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
            <div className="flex items-center justify-between border-b border-[#1e1e1e] px-4 py-3">
              <h3 className="font-semibold text-white">Dépôts récents</h3>
              <Link href="/seller/deposits" className="text-sm text-[#6366f1] hover:underline">
                Voir tout →
              </Link>
            </div>
            {recentDeposits.length === 0 ? (
              <p className="p-6 text-center text-gray-400">Aucun dépôt</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                      <th className="px-4 py-3">Montant USD</th>
                      <th className="px-4 py-3">TND crédité</th>
                      <th className="px-4 py-3">Méthode</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDeposits.map((d) => (
                      <tr key={d.id} className="border-b border-[#1e1e1e] last:border-0">
                        <td className="px-4 py-3 font-medium text-white">
                          ${d.amountUsd.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-[#6366f1]">{formatTND(d.amountTnd)}</td>
                        <td className="px-4 py-3 text-gray-400">{d.paymentMethod ?? '—'}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={d.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {formatDate(d.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
            <div className="flex items-center justify-between border-b border-[#1e1e1e] px-4 py-3">
              <h3 className="font-semibold text-white">Retraits récents</h3>
              <Link href="/seller/withdrawals" className="text-sm text-[#6366f1] hover:underline">
                Voir tout →
              </Link>
            </div>
            {recentWithdrawals.length === 0 ? (
              <p className="p-6 text-center text-gray-400">Aucun retrait</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                      <th className="px-4 py-3">Montant TND</th>
                      <th className="px-4 py-3">Méthode</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentWithdrawals.map((w) => (
                      <tr key={w.id} className="border-b border-[#1e1e1e] last:border-0">
                        <td className="px-4 py-3 font-medium text-white">
                          {formatTND(w.amountTnd)}
                        </td>
                        <td className="px-4 py-3 text-gray-400">{w.method}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={w.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {formatDate(w.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
