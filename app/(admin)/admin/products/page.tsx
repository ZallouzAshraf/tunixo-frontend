'use client'

import { useState } from 'react'
import {
  useAdminProducts,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useAdmin'
import { formatTND } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { toast } from 'sonner'
import type { Product } from '@/types'

export default function AdminProductsPage() {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const { data: products = [], isLoading } = useAdminProducts()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const handleToggleStatus = (p: Product) => {
    const newStatus = p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    updateProduct.mutate(
      { id: p.id, body: { status: newStatus } },
      {
        onSuccess: () => toast.success('Statut mis à jour'),
        onError: () => toast.error('Erreur'),
      },
    )
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deleteProduct.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Produit supprimé')
        setDeleteTarget(null)
      },
      onError: () => toast.error('Erreur'),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Produits</h1>
        <p className="mt-1 text-gray-400">Gérer le catalogue top-up et cartes cadeaux</p>
      </div>

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Prix TND</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#1e1e1e] last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{p.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          p.serviceType === 'GIFTCARD'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-blue-500/10 text-blue-400'
                        }`}
                      >
                        {p.serviceType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6366f1]">
                      {formatTND(p.priceTnd)} TND
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          disabled={updateProduct.isPending}
                          className="rounded bg-[#1e1e1e] px-2 py-1 text-xs font-medium text-gray-300 hover:bg-[#2a2a2a] disabled:opacity-50"
                        >
                          {p.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          className="rounded bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/30"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le produit"
        description={`Supprimer "${deleteTarget?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        isLoading={deleteProduct.isPending}
      />
    </div>
  )
}
