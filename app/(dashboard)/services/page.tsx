'use client'

import { useState, useMemo } from 'react'
import { useServices } from '@/hooks/useServices'
import ServiceCard from '@/components/services/ServiceCard'
import OrderModal from '@/components/services/OrderModal'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import type { Service } from '@/types'

const CATEGORIES = [
  'Tous',
  'AI Tools',
  'Design',
  'Productivity',
  'Entertainment',
] as const

export default function ServicesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('Tous')
  const [orderService, setOrderService] = useState<Service | null>(null)

  const { data: services = [], isLoading, isError } = useServices()

  const filtered = useMemo(() => {
    let list = services.filter((s) => s.isActive !== false)
    if (category && category !== 'Tous') {
      list = list.filter(
        (s) => (s.category ?? '').toLowerCase() === category.toLowerCase()
      )
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.description ?? '').toLowerCase().includes(q) ||
          (s.category ?? '').toLowerCase().includes(q)
      )
    }
    return list
  }, [services, category, search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Services disponibles
        </h1>
        <p className="mt-1 text-gray-400">
          Activés directement sur votre compte
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Rechercher un service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-[#1e1e1e] bg-[#111111] px-4 text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-[#6366f1] text-white'
                  : 'bg-[#111111] text-gray-400 hover:bg-white/5 hover:text-white border border-[#1e1e1e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center text-red-400">
          Erreur lors du chargement des services.
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#1e1e1e] bg-[#111111] py-20">
          <span className="text-5xl">🛒</span>
          <p className="mt-4 text-lg font-medium text-white">
            Aucun service trouvé
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Essayez une autre recherche
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOrder={() => setOrderService(service)}
            />
          ))}
        </div>
      )}

      {orderService && (
        <OrderModal
          service={orderService}
          isOpen={!!orderService}
          onClose={() => setOrderService(null)}
        />
      )}
    </div>
  )
}
