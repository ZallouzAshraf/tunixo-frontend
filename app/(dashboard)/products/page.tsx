'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/products/ProductCard'
import OrderModal from '@/components/products/OrderModal'
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton'
import EmptyState from '@/components/common/EmptyState'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { CATEGORIES } from '@/lib/constants'
import type { Product } from '@/types'

const ALL_ID = 'all'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') ?? ''
  const [category, setCategory] = useState<string>(
    categoryParam && CATEGORIES.some((c) => c.id === categoryParam)
      ? categoryParam
      : ALL_ID,
  )
  const [search, setSearch] = useState('')
  const [orderProduct, setOrderProduct] = useState<Product | null>(null)

  const fetchCategory =
    category === ALL_ID || category === 'gift-cards' ? undefined : category
  const { data: products = [], isLoading, isError } = useProducts(fetchCategory)

  const filtered = useMemo(() => {
    let list = products
    if (category === 'gift-cards') {
      list = list.filter((p) => p.serviceType === 'GIFTCARD')
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }
    return list
  }, [products, category, search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Top-up & Recharges
        </h1>
        <p className="mt-1 text-gray-400">
          Free Fire, PUBG, Google Play, PlayStation
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-[#1e1e1e] bg-[#111111] px-4 text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(ALL_ID)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              category === ALL_ID
                ? 'bg-[#6366f1] text-white'
                : 'border border-[#1e1e1e] bg-[#111111] text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Tous 🎮
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                category === c.id
                  ? 'bg-[#6366f1] text-white'
                  : 'border border-[#1e1e1e] bg-[#111111] text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {c.label} {c.emoji}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCategory('gift-cards')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              category === 'gift-cards'
                ? 'bg-[#6366f1] text-white'
                : 'border border-[#1e1e1e] bg-[#111111] text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Cartes cadeaux 🎁
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center text-red-400">
          Erreur lors du chargement des produits.
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🎮"
          title="Aucun produit trouvé"
          description="Essayez une autre recherche ou catégorie."
        />
      ) : (
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {filtered.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <ProductCard
                product={product}
                onOrder={() => setOrderProduct(product)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {orderProduct && (
        <OrderModal
          product={orderProduct}
          isOpen={!!orderProduct}
          onClose={() => setOrderProduct(null)}
        />
      )}
    </div>
  )
}
