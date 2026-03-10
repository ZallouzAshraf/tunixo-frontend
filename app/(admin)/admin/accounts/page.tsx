'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  useStockLevels,
  useAllAccounts,
  useAddAccount,
  useBulkAddAccounts,
  useDeleteAccount,
} from '@/hooks/useAccounts'
import { useAdminServices } from '@/hooks/useAdmin'
import { formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import AddAccountModal from '@/components/admin/AddAccountModal'
import BulkAddAccountsModal from '@/components/admin/BulkAddAccountsModal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
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

function progressBarColor(availablePct: number): string {
  if (availablePct > 30) return 'bg-green-500'
  if (availablePct >= 10) return 'bg-yellow-500'
  return 'bg-red-500'
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
  const [search, setSearch] = useState('')
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null)

  const { data: stockLevels = [], isLoading: stockLoading } = useStockLevels()
  const { data: allAccounts = [], isLoading: accountsLoading } = useAllAccounts()
  const { data: services = [] } = useAdminServices()
  const addAccount = useAddAccount()
  const bulkAdd = useBulkAddAccounts()
  const deleteAccount = useDeleteAccount()

  useEffect(() => {
    if (serviceParam) setServiceFilter(serviceParam)
  }, [serviceParam])

  const sortedLevels = useMemo(() => {
    return [...stockLevels].sort((a, b) => (a.available ?? 0) - (b.available ?? 0))
  }, [stockLevels])

  const serviceById = useMemo(() => {
    const map: Record<string, { name: string; category?: string }> = {}
    stockLevels.forEach((l) => {
      const name = l.service?.name ?? l.serviceId
      map[l.serviceId] = { name, category: l.service?.category }
    })
    services.forEach((s) => {
      map[s.id] = { name: s.name, category: s.category }
    })
    return map
  }, [stockLevels, services])

  const accountsWithServiceName: Array<Account & { serviceName?: string }> = useMemo(() => {
    return allAccounts.map((acc) => ({
      ...acc,
      serviceName: serviceById[acc.serviceId]?.name ?? acc.serviceId,
    }))
  }, [allAccounts, serviceById])

  const filteredAccounts = useMemo(() => {
    let list = accountsWithServiceName
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
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((a) => accountEmail(a).toLowerCase().includes(q))
    }
    return list
  }, [accountsWithServiceName, serviceFilter, statusFilter, search])

  const handleAddSingle = (payload: {
    serviceId: string
    credentials: Record<string, unknown>
    accountEmail?: string
  }) => {
    addAccount.mutate(
      {
        serviceId: payload.serviceId,
        accountEmail: payload.accountEmail,
        credentials: payload.credentials as Record<string, string>,
      },
      {
        onSuccess: () => {
          toast.success('Compte ajouté au stock ✅')
          setAddSingleOpen(false)
        },
        onError: () => toast.error('Erreur'),
      }
    )
  }

  const handleBulk = (payload: {
    serviceId: string
    accounts: Array<{ credentials: Record<string, unknown> }>
  }) => {
    bulkAdd.mutate(
      {
        serviceId: payload.serviceId,
        accounts: payload.accounts.map((a) => a.credentials as Record<string, string>),
      },
      {
        onSuccess: (_, variables) => {
          toast.success(`${variables.accounts.length} comptes ajoutés ✅`)
          setBulkOpen(false)
        },
        onError: () => toast.error('Erreur lors de l\'import ❌'),
      }
    )
  }

  const handleDeleteConfirm = () => {
    if (!deleteAccountId) return
    deleteAccount.mutate(deleteAccountId, {
      onSuccess: () => {
        toast.success('Compte supprimé')
        setDeleteAccountId(null)
      },
      onError: () => toast.error('Erreur'),
    })
  }

  const isLoading = stockLoading || accountsLoading

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion du stock</h1>
          <p className="mt-1 text-gray-400">Comptes disponibles par service</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setAddModalServiceId(undefined)
              setAddSingleOpen(true)
            }}
            className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
          >
            + Ajouter un compte
          </button>
          <button
            type="button"
            onClick={() => {
              setBulkModalServiceId(undefined)
              setBulkOpen(true)
            }}
            className="rounded-lg border border-[#6366f1] px-4 py-2 text-sm font-medium text-[#6366f1] hover:bg-[#6366f1]/10"
          >
            + Ajout en masse
          </button>
        </div>
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
            const availablePct = total ? (available / total) * 100 : 0
            const borderClass =
              available === 0
                ? 'border-red-500/50'
                : available <= 5
                  ? 'border-yellow-500/50'
                  : 'border-white/10'
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
                    className={`h-full ${progressBarColor(availablePct)}`}
                    style={{ width: `${availablePct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {available} / {total} disponibles
                </p>
                {available === 0 && (
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
                    + Ajouter
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
        <div className="flex flex-col gap-4 border-b border-[#1e1e1e] p-4">
          <h3 className="font-semibold text-white">Détail du stock</h3>
          <div className="flex flex-wrap items-center gap-3">
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
            <div className="flex gap-1 rounded-lg border border-[#1e1e1e] bg-[#111111] p-1">
              {[
                { id: '', label: 'Tous' },
                { id: 'AVAILABLE', label: 'Disponible' },
                { id: 'USED', label: 'Utilisé' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setStatusFilter(t.id)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    statusFilter === t.id ? 'bg-[#6366f1] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <input
              type="search"
              placeholder="Rechercher par email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 text-sm text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none sm:w-56"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Email compte</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Ajouté le</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc, i) => (
                <tr key={acc.id} className="border-b border-[#1e1e1e] last:border-0">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 shrink-0 rounded"
                        style={{
                          background: getGradientFromName(acc.serviceName ?? acc.serviceId),
                        }}
                      >
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                          {(acc.serviceName ?? acc.serviceId).charAt(0)}
                        </span>
                      </div>
                      <span className="text-white">{acc.serviceName ?? acc.serviceId}</span>
                    </div>
                  </td>
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
                  <td className="px-4 py-3">
                    {acc.status === 'AVAILABLE' && (
                      <button
                        type="button"
                        onClick={() => setDeleteAccountId(acc.id)}
                        className="rounded border border-red-500/30 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/10"
                      >
                        🗑️ Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAccounts.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <span className="text-4xl">📦</span>
            <p className="mt-4 font-medium text-white">Aucun compte en stock</p>
            <button
              type="button"
              onClick={() => setAddSingleOpen(true)}
              className="mt-4 rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
            >
              Ajouter votre premier compte
            </button>
          </div>
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

      <ConfirmDialog
        isOpen={!!deleteAccountId}
        onClose={() => setDeleteAccountId(null)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer ce compte"
        description="Ce compte sera définitivement retiré du stock. Cette action est irréversible."
        confirmText="Supprimer"
        isLoading={deleteAccount.isPending}
      />
    </div>
  )
}
