'use client'

import Link from 'next/link'
import type { Service } from '@/types'
import { formatTND } from '@/lib/utils'
import { cn } from '@/lib/utils'

function getGradientFromName(name: string): string {
  const hues = [250, 270, 300, 330, 200]
  const index = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length
  const h = hues[index]
  return `linear-gradient(135deg, hsl(${h}, 60%, 25%) 0%, hsl(${h + 30}, 50%, 35%) 100%)`
}

function getStockLabel(stockCount: number | undefined): { text: string; className: string } {
  if (stockCount === undefined || stockCount === null) {
    return { text: '📋 Sur commande', className: 'bg-gray-500/10 text-gray-400' }
  }
  if (stockCount === 0) {
    return { text: '📋 Sur commande', className: 'bg-gray-500/10 text-gray-400' }
  }
  if (stockCount <= 5) {
    return { text: '⚠️ Stock limité', className: 'bg-yellow-500/10 text-yellow-500' }
  }
  return { text: '✅ Disponible', className: 'bg-green-500/10 text-green-500' }
}

interface ServiceCardProps {
  service: Service
  onOrder: () => void
}

export default function ServiceCard({ service, onOrder }: ServiceCardProps) {
  const gradient = getGradientFromName(service.name)
  const stock = getStockLabel(service.stockCount)
  const initial = (service.name || 'S').charAt(0).toUpperCase()

  return (
    <div
      className={cn(
        'flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#1e1e1e] bg-[#111111] transition-all duration-300 hover:border-[#6366f1]/30 hover:shadow-lg hover:shadow-[#6366f1]/5'
      )}
    >
      <Link href={`/services/${service.slug}`} className="flex flex-col flex-1">
        <div
          className="relative h-[120px] w-full shrink-0"
          style={{
            background: service.imageUrl
              ? `url(${service.imageUrl}) center/cover`
              : gradient,
          }}
        >
          {!service.imageUrl && (
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/80">
              {initial}
            </span>
          )}
          {service.category && (
            <span className="absolute right-2 top-2 rounded bg-black/40 px-2 py-0.5 text-xs text-white">
              {service.category}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold text-white">{service.name}</h3>
          {service.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-400">
              {service.description}
            </p>
          )}
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-lg font-bold text-[#6366f1]">
              {formatTND(service.priceTnd)}
            </span>
            <span className="text-sm text-gray-500">/ mois</span>
          </div>
          <span
            className={cn(
              'mt-2 inline-block w-fit rounded px-2 py-0.5 text-xs',
              stock.className
            )}
          >
            {stock.text}
          </span>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            onOrder()
          }}
          className="w-full rounded-lg bg-[#6366f1] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5558e3]"
        >
          Commander
        </button>
      </div>
    </div>
  )
}
