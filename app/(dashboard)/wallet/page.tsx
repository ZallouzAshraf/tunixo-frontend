'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useWalletBalance, useTransactions } from '@/hooks/useWallet'
import { formatTND } from '@/lib/utils'
import TopupModal from '@/components/wallet/TopupModal'
import TransactionList from '@/components/wallet/TransactionList'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const QUICK_AMOUNTS = [20, 50, 100, 200]
const FILTERS = [
  { id: 'all' as const, label: 'Toutes' },
  { id: 'credit' as const, label: 'Crédits' },
  { id: 'debit' as const, label: 'Débits' },
] as const

type FilterId = 'all' | 'credit' | 'debit'

export default function WalletPage() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const status = searchParams.get('status')

  const [topupOpen, setTopupOpen] = useState(false)
  const [topupDefaultAmount, setTopupDefaultAmount] = useState<number | undefined>()
  const [filter, setFilter] = useState<FilterId>('all')
  const [banner, setBanner] = useState<'success' | 'failed' | null>(null)

  const { data: balanceData, isLoading: balanceLoading } = useWalletBalance()
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions()

  const balance = balanceData?.balance ?? 0

  // Sync URL status to banner and invalidate wallet when success
  useEffect(() => {
    if (status === 'success') {
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      setBanner('success')
    } else if (status === 'failed') {
      setBanner('failed')
    }
  }, [status, queryClient])

  // Auto-dismiss banner after 5s
  useEffect(() => {
    if (!banner) return
    const t = setTimeout(() => setBanner(null), 5000)
    return () => clearTimeout(t)
  }, [banner])

  const isLoading = balanceLoading || transactionsLoading

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Mon Wallet</h1>
        <p className="mt-1 text-gray-400">
          Gérez votre solde et vos transactions
        </p>
      </div>

      {/* Payment status banner */}
      {banner === 'success' && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
          ✅ Paiement réussi ! Votre wallet a été rechargé.
        </div>
      )}
      {banner === 'failed' && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
          ❌ Paiement échoué. Veuillez réessayer.
        </div>
      )}

      {/* Balance card */}
      <div className="relative overflow-hidden rounded-xl border border-[#6366f1]/30 bg-[#111111] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-transparent" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">Solde disponible</p>
            {isLoading ? (
              <LoadingSpinner size="lg" className="mt-2" />
            ) : (
              <p className="mt-1 text-3xl font-bold text-white sm:text-4xl">
                {formatTND(balance)}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Mis à jour maintenant</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTopupDefaultAmount(undefined)
              setTopupOpen(true)
            }}
            className="shrink-0 rounded-lg bg-[#6366f1] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#5558e3]"
          >
            Recharger mon wallet
          </button>
        </div>
      </div>

      {/* Quick topup amounts */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-400">Montant rapide</h3>
        <div className="flex flex-wrap gap-3">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setTopupDefaultAmount(a)
                setTopupOpen(true)
              }}
              className="rounded-xl border border-[#1e1e1e] bg-[#111111] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-[#6366f1]/50"
            >
              {a} TND
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Historique des transactions
            </h3>
            <p className="text-sm text-gray-500">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-1 rounded-lg border border-[#1e1e1e] bg-[#111111] p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-[#6366f1] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] px-4">
          {transactionsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <span className="text-5xl">💳</span>
              <p className="mt-4 font-medium text-white">Aucune transaction</p>
              <p className="mt-1 text-sm text-gray-500">
                Rechargez votre wallet pour commencer
              </p>
              <button
                type="button"
                onClick={() => setTopupOpen(true)}
                className="mt-4 rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
              >
                Recharger maintenant
              </button>
            </div>
          ) : (
            <TransactionList transactions={transactions} filter={filter} />
          )}
        </div>
      </div>

      <TopupModal
        isOpen={topupOpen}
        onClose={() => setTopupOpen(false)}
        defaultAmount={topupDefaultAmount}
      />
    </div>
  )
}
