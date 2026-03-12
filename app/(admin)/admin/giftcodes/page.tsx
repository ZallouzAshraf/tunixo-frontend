'use client'

import { useState } from 'react'
import { useAdminProducts, useGiftCodesStats, useBulkCreateGiftCodes } from '@/hooks/useAdmin'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { toast } from 'sonner'

export default function AdminGiftCodesPage() {
  const [productId, setProductId] = useState('')
  const [codesText, setCodesText] = useState('')

  const { data: products = [], isLoading: productsLoading } = useAdminProducts()
  const { data: stats = [], isLoading: statsLoading } = useGiftCodesStats()
  const bulkCreate = useBulkCreateGiftCodes()

  const giftProducts = products.filter((p) => p.serviceType === 'GIFTCARD')
  const codes = codesText
    .split(/[\n,]+/)
    .map((c) => c.trim())
    .filter(Boolean)

  const handleBulkAdd = () => {
    if (!productId || codes.length === 0) {
      toast.error('Sélectionnez un produit et saisissez au moins un code')
      return
    }
    bulkCreate.mutate(
      { productId, codes },
      {
        onSuccess: (data: { created?: number; message?: string }) => {
          toast.success(data.message ?? `${data.created ?? 0} codes ajoutés`)
          setCodesText('')
        },
        onError: () => toast.error('Erreur'),
      },
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Codes cadeaux</h1>
        <p className="mt-1 text-gray-400">
          Stock et ajout en masse
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Stock par produit
        </h2>
        {statsLoading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => {
              const color =
                s.available > 10
                  ? 'border-green-500/30 bg-green-500/10'
                  : s.available >= 5
                    ? 'border-yellow-500/30 bg-yellow-500/10'
                    : 'border-red-500/30 bg-red-500/10'
              return (
                <div
                  key={s.productId}
                  className={`rounded-xl border p-4 ${color}`}
                >
                  <p className="font-medium text-white">{s.productName}</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {s.available} codes
                  </p>
                  <p className="text-xs text-gray-400">disponibles</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Ajouter des codes en masse
        </h2>
        {productsLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Produit
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] px-4 py-2 text-white"
              >
                <option value="">— Sélectionner —</option>
                {giftProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Codes (un par ligne ou séparés par des virgules)
              </label>
              <textarea
                value={codesText}
                onChange={(e) => setCodesText(e.target.value)}
                rows={6}
                placeholder="CODE1&#10;CODE2&#10;CODE3"
                className="w-full rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] px-4 py-2 font-mono text-sm text-white placeholder:text-gray-500"
              />
            </div>
            <button
              type="button"
              onClick={handleBulkAdd}
              disabled={!productId || codes.length === 0 || bulkCreate.isPending}
              className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3] disabled:opacity-50"
            >
              {bulkCreate.isPending
                ? 'Ajout...'
                : `Ajouter ${codes.length} code${codes.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
