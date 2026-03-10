'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  useStockLevels,
  useAdminServices,
  useAddAccount,
  useBulkAddAccounts,
} from '@/hooks/useAdmin'
import { formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import AddAccountModal from '@/components/admin/AddAccountModal'
import BulkAddAccountsModal from '@/components/admin/BulkAddAccountsModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import type { StockLevelItem, Account } from '@/types'

function getGradientFromName(name: string): string {
  const hues = [250, 270, 300, 330, 200]
  const index = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length
  const h = hues[index]
  return `linear-gradient(135deg, hsl(${h}, 60%, 25%) 0%, hsl(${h + 30}, 50%, 35%) 100%)`
}

function accountEmail(account: Account): string {
  const creds = account.credentials as Record<string, string> | undefined
  return creds?.email ?? creds?.username ?? ''
}

export default function AdminAccountsPage() {
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get('service') ?? ''

  const [addSingleOpen, setAddSingleOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [addModalServiceId, setAddModalServiceId] = useState<string | undefined>(undefined)
  const [bulkModalServiceId, setBulkModalServiceId] = useState<string | undefined>(undefined)
  const [serviceFilter, setServiceFilter] = useState(serviceParam)
  const [statusFilter, setStatusFilter] = useState('')

  const { data: stockLevels = [], isLoading } = useStockLevels()
  const { data: services = [] } = useAdminServices()
  const addAccount = useAddAccount()
  const bulkAdd = useBulkAddAccounts()

  useEffect(() => {
    if (serviceParam) setServiceFilter(serviceParam)
  }, [serviceParam])

  const sortedLevels = useMemo(() => {
    return [...stockLevels].sort(
      (a, b) => (a.available ?? 0) - (b.available ?? 0)
    )
  }, [stockLevels])

  const allAccounts: Array<Account & { serviceName?: string }> = useMemo(() => {
    const list: Array<Account & { serviceName?: string }> = []
    stockLevels.forEach((level) => {
      const name = level.service?.name ?? level.serviceId
      ;(level.accounts ?? []).forEach((acc) => {
        list.push({ ...acc, serviceName: name })
      })
    })
    return list
  }, [stockLevels])

  const filteredAccounts = useMemo(() => {
    let list = allAccounts
    if (serviceFilter) {
      list = list.filter((a) => a.serviceId === serviceFilter)
    }
    if (statusFilter === 'AVAILABLE') {
      list = list.filter((a) => a.status === 'AVAILABLE')
    } else if (statusFilter === 'USED') {
      list = list.filter((a) => a.status === 'USED')
    } else if (statusFilter === 'RESERVED') {
      list = list.filter((a) => a.status === 'RESERVED')
    }
    return list
  }, [allAccounts, serviceFilter, statusFilter])

  const handleAddSingle = (payload: {
    serviceId: string
    credentials: Record<string, unknown>
    accountEmail?: string
  }) => {
    addAccount.mutate(payload, {
      onSuccess: () => {
        toast.success('Compte ajouté ✅')
        setAddSingleOpen(false)
      },
      onError: () => toast.error('Erreur'),
    })
  }

  const handleBulk = (payload: {
    serviceId: string
    accounts: Array<{ credentials: Record<string, unknown> }>
  }) => {
    bulkAdd.mutate(payload, {
      onSuccess: (_, variables) => {
        toast.success(`${variables.accounts.length} comptes ajoutés ✅`)
        setBulkOpen(false)
      },
      onError: () => toast.error('Erreur'),
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestion du stock</h1>
        <p className="mt-1 text-gray-400">Comptes disponibles par service</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedLevels.map((level) => {
            const name = level.service?.name ?? level.serviceId
            const available = level.available ?? 0
            const used = level.used ?? 0
            const total = (level.total ?? available + used) || 1
            const pct = total ? (used / total) * 100 : 0
            const isLow = available <= 5
            const isZero = available === 0
            const borderClass = isZero
              ? 'border-red-500/50'
              : isLow
                ? 'border-yellow-500/50'
                : 'border-[#1e1e1e]'
            return (
              <div
                key={level.serviceId}
                className={`rounded-xl border bg-[#111111] p-4 ${borderClass}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-10 w-10 shrink-0 rounded-lg"
                    style={{ background: getGradientFromName(name) }}
                  >
                    <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                      {name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{name}</p>
                    <span className="rounded bg-[#1e1e1e] px-2 py-0.5 text-xs text-gray-400">
                      {level.service?.category ?? '—'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-gray-400">Disponible: {available}</span>
                  <span className="text-gray-400">Utilisé: {used}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1e1e1e]">
                  <div
                    className={`h-full ${
                      isZero ? 'bg-red-500' : isLow ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {isZero && (
                  <p className="mt-2 text-sm text-red-400">⚠️ Stock épuisé</p>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddModalServiceId(level.serviceId)
                      setAddSingleOpen(true)
                    }}
                    className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-1.5 text-sm text-white hover:bg-[#1e1e1e]"
                  >
                    + Ajouter un compte
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBulkModalServiceId(level.serviceId)
                      setBulkOpen(true)
                    }}
                    className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-1.5 text-sm text-white hover:bg-[#1e1e1e]"
                  >
                    + Ajout en masse
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
        <div className="flex flex-col gap-4 border-b border-[#1e1e1e] p-4 sm:flex-row sm:items-center">
          <h3 className="font-semibold text-white">Détail du stock</h3>
          <div className="flex flex-wrap gap-2">
            <Select value={serviceFilter} onValueChange={(v) => setServiceFilter(v ?? '')}>
              <SelectTrigger className="w-[200px] border-[#1e1e1e] bg-[#111111] text-white">
                <SelectValue placeholder="Tous les services" />
              </SelectTrigger>
              <SelectContent className="border-[#1e1e1e] bg-[#111111]">
                <SelectItem value="" className="text-white">
                  Tous les services
                </SelectItem>
                {stockLevels.map((level) => {
                  const name = level.service?.name ?? level.serviceId
                  return (
                    <SelectItem key={level.serviceId} value={level.serviceId} className="text-white">
                      {name}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? '')}>
              <SelectTrigger className="w-[160px] border-[#1e1e1e] bg-[#111111] text-white">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="border-[#1e1e1e] bg-[#111111]">
                <SelectItem value="" className="text-white">
                  Tous
                </SelectItem>
                <SelectItem value="AVAILABLE" className="text-white">
                  Disponible
                </SelectItem>
                <SelectItem value="USED" className="text-white">
                  Utilisé
                </SelectItem>
                <SelectItem value="RESERVED" className="text-white">
                  Réservé
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Email compte</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Ajouté le</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc, i) => (
                <tr key={acc.id} className="border-b border-[#1e1e1e] last:border-0">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-white">{acc.serviceName ?? acc.serviceId}</td>
                  <td className="px-4 py-3 text-gray-400">{accountEmail(acc) || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        acc.status === 'AVAILABLE'
                          ? 'bg-green-500/20 text-green-400'
                          : acc.status === 'RESERVED'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {acc.status === 'AVAILABLE'
                        ? 'Disponible'
                        : acc.status === 'RESERVED'
                          ? 'Réservé'
                          : 'Utilisé'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {formatDate(acc.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAccounts.length === 0 && (
          <p className="p-8 text-center text-gray-400">Aucun compte</p>
        )}
      </div>

      <AddAccountModal
        isOpen={addSingleOpen}
        onClose={() => setAddSingleOpen(false)}
        services={services}
        preselectedServiceId={(addModalServiceId ?? serviceParam) || undefined}
        onSubmit={handleAddSingle}
        isLoading={addAccount.isPending}
      />
      <BulkAddAccountsModal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        services={services}
        preselectedServiceId={(bulkModalServiceId ?? serviceParam) || undefined}
        onSubmit={handleBulk}
        isLoading={bulkAdd.isPending}
      />
    </div>
  )
}
