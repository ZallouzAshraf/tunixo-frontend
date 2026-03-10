'use client'

import { useState, useMemo } from 'react'
import {
  useAdminWithdrawals,
  useCompleteWithdrawal,
  useRejectWithdrawal,
} from '@/hooks/useAdmin'
import { formatTND, formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatusBadge from '@/components/common/StatusBadge'
import RejectReasonDialog from '@/components/admin/RejectReasonDialog'
import CompleteWithdrawalDialog from '@/components/admin/CompleteWithdrawalDialog'
import { toast } from 'sonner'
import type { SellerWithdrawal } from '@/types'

const TABS = [
  { id: 'PENDING', label: 'En attente' },
  { id: 'COMPLETED', label: 'Complétés' },
  { id: 'REJECTED', label: 'Rejetés' },
] as const

function methodDetailsDisplay(w: SellerWithdrawal): string {
  const details = w.methodDetails as Record<string, string> | undefined
  const phone = details?.phone ?? details?.number ?? ''
  const iban = details?.iban ?? ''
  if (w.method.toUpperCase() === 'D17' && phone) return `📱 ${phone}`
  if (iban) return `🏦 IBAN: ${iban}`
  return Object.keys(details ?? {}).length ? JSON.stringify(details) : w.method
}

export default function AdminWithdrawalsPage() {
  const [tab, setTab] = useState('PENDING')
  const [completeId, setCompleteId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)

  const { data, isLoading } = useAdminWithdrawals(tab || undefined)
  const completeMutation = useCompleteWithdrawal()
  const rejectMutation = useRejectWithdrawal()

  const withdrawals: SellerWithdrawal[] = useMemo(() => {
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object' && 'data' in data)
      return (data as { data: SellerWithdrawal[] }).data
    return []
  }, [data])

  const withdrawalToComplete = completeId
    ? withdrawals.find((w) => w.id === completeId)
    : null

  const handleComplete = (note?: string) => {
    if (!completeId) return
    completeMutation.mutate(
      { id: completeId, note },
      {
        onSuccess: () => {
          toast.success('Retrait marqué complété')
          setCompleteId(null)
        },
        onError: () => toast.error('Erreur'),
      }
    )
  }

  const handleReject = (reason: string) => {
    if (!rejectId) return
    rejectMutation.mutate(
      { id: rejectId, rejectionReason: reason },
      {
        onSuccess: () => {
          toast.success('Retrait rejeté et remboursé')
          setRejectId(null)
        },
        onError: () => toast.error('Erreur'),
      }
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestion des retraits</h1>
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                  <th className="px-4 py-3">Vendeur</th>
                  <th className="px-4 py-3">Montant TND</th>
                  <th className="px-4 py-3">Méthode</th>
                  <th className="px-4 py-3">Détails paiement</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-[#1e1e1e] last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">
                        {w.seller?.fullName ?? w.seller?.email ?? w.sellerId}
                      </div>
                      {w.seller?.email && (
                        <div className="text-xs text-gray-500">{w.seller.email}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {formatTND(w.amountTnd)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{w.method}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {methodDetailsDisplay(w)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatDate(w.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {w.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setCompleteId(w.id)}
                            className="rounded bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 hover:bg-green-500/30"
                          >
                            ✅ Complété
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectId(w.id)}
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
        {!isLoading && withdrawals.length === 0 && (
          <p className="p-8 text-center text-gray-400">Aucun retrait</p>
        )}
      </div>

      {withdrawalToComplete && (
        <CompleteWithdrawalDialog
          isOpen={!!completeId}
          onClose={() => setCompleteId(null)}
          onConfirm={handleComplete}
          sellerName={
            withdrawalToComplete.seller?.fullName ??
            withdrawalToComplete.seller?.email ??
            withdrawalToComplete.sellerId
          }
          amountTnd={withdrawalToComplete.amountTnd}
          method={withdrawalToComplete.method}
          isLoading={completeMutation.isPending}
        />
      )}

      <RejectReasonDialog
        isOpen={!!rejectId}
        onClose={() => setRejectId(null)}
        onConfirm={handleReject}
        title="Rejeter le retrait"
        description="Indiquez la raison. Le montant sera remboursé sur le solde du vendeur."
        confirmText="Rejeter et rembourser"
        isLoading={rejectMutation.isPending}
      />
    </div>
  )
}
