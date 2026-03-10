'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useAdminServices,
  useCreateService,
  useUpdateService,
  useToggleService,
} from '@/hooks/useAdmin'
import { formatTND } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ServiceModal from '@/components/admin/ServiceModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import type { Service } from '@/types'
import { MoreHorizontal } from 'lucide-react'

function getGradientFromName(name: string): string {
  const hues = [250, 270, 300, 330, 200]
  const index = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length
  const h = hues[index]
  return `linear-gradient(135deg, hsl(${h}, 60%, 25%) 0%, hsl(${h + 30}, 50%, 35%) 100%)`
}

function stockBadge(stockCount: number | undefined) {
  if (stockCount === undefined || stockCount === null) {
    return { text: '—', className: 'bg-gray-500/20 text-gray-400' }
  }
  if (stockCount === 0) {
    return { text: 'Rupture', className: 'bg-red-500/20 text-red-400' }
  }
  if (stockCount <= 5) {
    return { text: `${stockCount} dispo`, className: 'bg-yellow-500/20 text-yellow-400' }
  }
  return { text: `${stockCount} dispo`, className: 'bg-green-500/20 text-green-400' }
}

export default function AdminServicesPage() {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editService, setEditService] = useState<Service | null>(null)

  const { data: services = [], isLoading } = useAdminServices()
  const createService = useCreateService()
  const updateService = useUpdateService()
  const toggleService = useToggleService()

  const total = services.length
  const active = services.filter((s) => s.isActive).length
  const inactive = total - active

  const handleCreate = (data: {
    name: string
    description?: string
    priceTnd: number
    priceUsd: number
    category?: string
    imageUrl?: string
    deliveryType: 'ACCOUNT' | 'MANUAL'
  }) => {
    createService.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        priceTnd: data.priceTnd,
        priceUsd: data.priceUsd,
        category: data.category || undefined,
        imageUrl: (data.imageUrl && data.imageUrl.trim()) ? data.imageUrl : undefined,
        deliveryType: data.deliveryType,
      },
      {
        onSuccess: () => {
          toast.success('Service créé ✅')
          setCreateOpen(false)
        },
        onError: () => toast.error('Erreur lors de la création'),
      }
    )
  }

  const handleUpdate = (data: {
    name: string
    description?: string
    priceTnd: number
    priceUsd: number
    category?: string
    imageUrl?: string
    deliveryType: 'ACCOUNT' | 'MANUAL'
  }) => {
    if (!editService) return
    updateService.mutate(
      {
        id: editService.id,
        body: {
          name: data.name,
          description: data.description || undefined,
          priceTnd: data.priceTnd,
          priceUsd: data.priceUsd,
          category: data.category || undefined,
          imageUrl: (data.imageUrl && data.imageUrl.trim()) ? data.imageUrl : undefined,
          deliveryType: data.deliveryType,
        },
      },
      {
        onSuccess: () => {
          toast.success('Service mis à jour')
          setEditService(null)
        },
        onError: () => toast.error('Erreur'),
      }
    )
  }

  const handleToggle = (s: Service) => {
    toggleService.mutate(s.id, {
      onSuccess: () => toast.success(s.isActive ? 'Service désactivé' : 'Service activé'),
      onError: () => toast.error('Erreur'),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des services</h1>
          <p className="mt-1 text-gray-400">{total} services au total</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
        >
          + Nouveau service
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <p className="text-2xl font-bold text-green-400">{active}</p>
          <p className="text-sm text-gray-400">services actifs</p>
        </div>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
          <p className="text-2xl font-bold text-gray-400">{inactive}</p>
          <p className="text-sm text-gray-400">services inactifs</p>
        </div>
        <div className="rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/5 p-4">
          <p className="text-2xl font-bold text-[#6366f1]">{total}</p>
          <p className="text-sm text-gray-400">services au total</p>
        </div>
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
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Prix TND</th>
                  <th className="px-4 py-3">Prix USD</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s, i) => {
                  const stock = stockBadge(s.stockCount)
                  return (
                    <tr key={s.id} className="border-b border-[#1e1e1e] last:border-0">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-8 shrink-0 rounded-lg"
                            style={{ background: getGradientFromName(s.name) }}
                          >
                            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                              {s.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-white">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-[#1e1e1e] px-2 py-0.5 text-xs text-gray-400">
                          {s.category ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#6366f1]">
                        {formatTND(s.priceTnd)}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        ${s.priceUsd.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${stock.className}`}
                        >
                          {stock.text}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggle(s)}
                          disabled={toggleService.isPending}
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            s.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {s.isActive ? 'Actif' : 'Inactif'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="rounded p-1 text-gray-400 hover:bg-white/5 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-52 border-[#1e1e1e] bg-[#111111]"
                          >
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onSelect={() => setEditService(s)}
                            >
                              ✏️ Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onSelect={() => handleToggle(s)}
                            >
                              🔄 Toggle actif/inactif
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onSelect={() => router.push(`/admin/accounts?service=${s.id}`)}
                            >
                              📦 Gérer le stock
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && services.length === 0 && (
          <p className="p-8 text-center text-gray-400">Aucun service</p>
        )}
      </div>

      <ServiceModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        onSubmit={handleCreate}
        isLoading={createService.isPending}
      />
      <ServiceModal
        isOpen={!!editService}
        onClose={() => setEditService(null)}
        mode="edit"
        service={editService}
        onSubmit={handleUpdate}
        isLoading={updateService.isPending}
      />
    </div>
  )
}
