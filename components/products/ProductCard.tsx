'use client'

import type { Product } from '@/types'
import { formatTND } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'

function getCategoryEmoji(category: string): string {
  const found = CATEGORIES.find((c) => c.id === category)
  return found?.emoji ?? '🎮'
}

interface ProductCardProps {
  product: Product
  onOrder: (product: Product) => void
}

export default function ProductCard({ product, onOrder }: ProductCardProps) {
  const emoji = getCategoryEmoji(product.category)
  const isGiftCard = product.serviceType === 'GIFTCARD'

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-[#1e1e1e] bg-[#111111] transition-all duration-300 hover:border-[#6366f1]/30 hover:shadow-lg hover:shadow-[#6366f1]/5',
      )}
    >
      <div className="relative h-[120px] w-full shrink-0 flex items-center justify-center bg-[#1e1e1e]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-5xl">{emoji}</span>
        )}
        {product.category && (
          <span className="absolute right-2 top-2 rounded bg-black/40 px-2 py-0.5 text-xs text-white">
            {product.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-white">{product.name}</h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-400">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-xl font-bold text-[#6366f1]">
            {formatTND(product.priceTnd)}
          </span>
          <span className="text-sm text-gray-500"> TND</span>
        </div>
        <span
          className={cn(
            'mt-2 inline-block w-fit rounded px-2 py-0.5 text-xs',
            isGiftCard
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
          )}
        >
          {isGiftCard ? '⚡ Instantané' : '🎮 Top-up Auto'}
        </span>
      </div>

      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={() => onOrder(product)}
          className="w-full rounded-lg bg-[#6366f1] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5558e3]"
        >
          Commander
        </button>
      </div>
    </div>
  )
}
