'use client'

import { useState, useMemo } from 'react'
import { useAdminDeposits, useConfirmDeposit, useRejectDeposit } from '@/hooks/useAdmin'
import { formatTND, formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatusBadge from '@/components/common/StatusBadge'
import RejectReasonDialog from '@/components/admin/RejectReasonDialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { SellerDeposit } from '@/types'

const TABS = [
  { id: 'PENDING', label: 'En attente', badge: true },
  { id: 'CONFIRMED', label: 'Confirmés' },
  { id: 'REJECTED', label: 'Rejetés' },
  { id: '', label: 'Tous' },
] as const

export default function AdminDepositsPage() {
  const [tab, setTab] = useState('PENDING')
  const [confirmDeposit, setConfirmDeposit] = useState<SellerDeposit | null>(null)
  const [confirmExchangeRate, setConfirmExchangeRate] = useState('')
  const [rejectDepositId, setRejectDepositId] = useState<string | null>(null)

  const { data, isLoading } = useAdminDeposits(tab || undefined)
  const { data: pendingList = [] } = useAdminDeposits('PENDING')
  const confirmMutation = useConfirmDeposit()
  const rejectMutation = useRejectDeposit()

  const deposits: SellerDeposit[] = useMemo(() => {
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object' && 'data' in data) return (data as { data: SellerDeposit[] }).data
    return []
  }, [data])

  const pendingListArray = Array.isArray(pendingList) ? pendingList : (pendingList as { data?: SellerDeposit[] })?.data ?? []
  const pendingCount = pendingListArray.length
  const totalUsd = deposits.reduce((s, d) => s + d.amountUsd, 0)

  const handleConfirmSubmit = () => {
    if (!confirmDeposit) return
    const rate = confirmExchangeRate ? parseFloat(confirmExchangeRate) : undefined
    confirmMutation.mutate(
      { id: confirmDeposit.id, exchangeRate: rate },
      {
        onSuccess: () => {
          toast.success('Dépôt confirmé')
          setConfirmDeposit(null)
          setConfirmExchangeRate('')
        },
        onError: () => toast.error('Erreur'),
      }
    )
  }

  const handleRejectSubmit = (reason: string) => {
    if (!rejectDepositId) return
    rejectMutation.mutate(
      { id: rejectDepositId, rejectionReason: reason },
      {
        onSuccess: () => {
          toast.success('Dépôt rejeté')
          setRejectDepositId(null)
        },
        onError: () => toast.error('Erreur'),
      }
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestion des dépôts</h1>
        <p className="mt-1 text-gray-400">
          Total déposé: ${totalUsd.toFixed(2)} USD
          {tab === 'PENDING' && pendingCount > 0 && (
            <span className="ml-2 text-red-400">• {pendingCount} en attente</span>
          )}
        </p>
      </div>

      <div className="flex gap-2 rounded-lg border border-[#1e1e1e] bg-[#111111] p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-[#6366f1] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
            {(t as { badge?: boolean }).badge && pendingCount > 0 && (
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                  <th className="px-4 py-3">Vendeur</th>
                  <th className="px-4 py-3">USD</th>
                  <th className="px-4 py-3">TND crédité</th>
                  <th className="px-4 py-3">Méthode</th>
                  <th className="px-4 py-3">Preuve</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((d) => (
                  <tr key={d.id} className="border-b border-[#1e1e1e] last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">
                        {d.seller?.fullName ?? d.seller?.email ?? d.sellerId}
                      </div>
                      {d.seller?.email && (
                        <div className="text-xs text-gray-500">{d.seller.email}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      ${d.amountUsd.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-[#6366f1]">{formatTND(d.amountTnd)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-gray-500/20 px-2 py-0.5 text-xs text-gray-400">
                        {d.paymentMethod ?? '—'}
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
                          Voir preuve
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatDate(d.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {d.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDeposit(d)
                              setConfirmExchangeRate(d.exchangeRate?.toString() ?? '')
                            }}
                            className="rounded bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 hover:bg-green-500/30"
                          >
                            ✅ Confirmer
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectDepositId(d.id)}
                            className="rounded bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/30"
                          >
                            ❌ Rejeter
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && deposits.length === 0 && (
          <p className="p-8 text-center text-gray-400">Aucun dépôt</p>
        )}
      </div>

      {/* Confirm modal */}
      {confirmDeposit && (
        <ConfirmDepositModal
          isOpen={!!confirmDeposit}
          onClose={() => { setConfirmDeposit(null); setConfirmExchangeRate('') }}
          deposit={confirmDeposit}
          exchangeRate={confirmExchangeRate}
          setExchangeRate={setConfirmExchangeRate}
          onConfirm={handleConfirmSubmit}
          isLoading={confirmMutation.isPending}
        />
      )}

      <RejectReasonDialog
        isOpen={!!rejectDepositId}
        onClose={() => setRejectDepositId(null)}
        onConfirm={handleRejectSubmit}
        title="Rejeter ce dépôt"
        description="Indiquez la raison du rejet."
        confirmText="Rejeter"
        isLoading={rejectMutation.isPending}
      />
    </div>
  )
}

function ConfirmDepositModal({
  isOpen,
  onClose,
  deposit,
  exchangeRate,
  setExchangeRate,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  deposit: SellerDeposit
  exchangeRate: string
  setExchangeRate: (v: string) => void
  onConfirm: () => void
  isLoading: boolean
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Confirmer ce dépôt</DialogTitle>
          <DialogDescription>
            Vendeur: {deposit.seller?.fullName ?? deposit.seller?.email ?? deposit.sellerId}.
            Montant: ${deposit.amountUsd.toFixed(2)}. TND à créditer: {deposit.amountTnd.toFixed(3)} TND.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Taux de change (optionnel)
          </label>
          <input
            type="number"
            step="any"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            className="w-full rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2 text-white focus:border-[#6366f1] focus:outline-none"
          />
        </div>
        <DialogFooter showCloseButton={false} className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : 'Confirmer et créditer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
