'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useOrder } from '@/hooks/useOrders'
import { formatTND, formatDateTime } from '@/lib/utils'
import OrderStatus from '@/components/orders/OrderStatus'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import type { OrderStatus as OrderStatusType } from '@/types'

function getGradientFromName(name: string): string {
  const hues = [250, 270, 300, 330, 200]
  const index = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length
  const h = hues[index]
  return `linear-gradient(135deg, hsl(${h}, 60%, 25%) 0%, hsl(${h + 30}, 50%, 35%) 100%)`
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const copy = () => {
    navigator.clipboard.writeText(value)
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded border border-[#1e1e1e] bg-[#111111] px-2 py-1 text-xs text-gray-400 hover:text-white"
    >
      {label}
    </button>
  )
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const { data: order, isLoading, isError } = useOrder(id)

  useEffect(() => {
    if (!id) return
    if (isError || (!isLoading && !order)) {
      router.replace('/orders')
    }
  }, [id, isError, isLoading, order, router])

  if (!id || isLoading || isError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!order) return null

  const productName = order.product?.name ?? 'Produit'
  const productCategory = order.product?.category
  const productDescription = order.product?.description
  const gradient = getGradientFromName(productName)
  const initial = productName.charAt(0).toUpperCase()
  const shortId = order.id.length > 8 ? order.id.slice(-8) : order.id
  const detailsDisplay =
    order.status === 'COMPLETED' && order.deliveredCode
      ? order.deliveredCode
      : order.product?.serviceType === 'TOPUP'
        ? (order.playerUsername || order.playerId || '—')
        : '—'

  return (
    <div className="space-y-8">
      <nav className="text-sm text-gray-400">
        <Link href="/orders" className="hover:text-white">
          Mes commandes
        </Link>
        <span className="mx-2">›</span>
        <span className="text-white">#{shortId}</span>
      </nav>

      <OrderStatus
        status={order.status}
        productName={productName}
        productCategory={productCategory}
        failureReason={order.failureReason}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Détails de la commande
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <dt className="w-32 shrink-0 text-gray-500">Commande ID</dt>
              <dd className="flex items-center gap-2 font-mono text-white">
                #{order.id}
                <CopyButton value={order.id} label="Copier" />
              </dd>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <dt className="w-32 shrink-0 text-gray-500">Produit</dt>
              <dd className="text-white">{productName}</dd>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <dt className="w-32 shrink-0 text-gray-500">Détails</dt>
              <dd className="flex flex-wrap items-center gap-2 text-white">
                {detailsDisplay}
                {order.status === 'COMPLETED' && order.deliveredCode && (
                  <CopyButton value={order.deliveredCode} label="Copier" />
                )}
              </dd>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <dt className="w-32 shrink-0 text-gray-500">Statut</dt>
              <dd>
                <StatusBadge status={order.status as OrderStatusType} />
              </dd>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <dt className="w-32 shrink-0 text-gray-500">Montant payé</dt>
              <dd className="text-[#6366f1]">{formatTND(order.amountPaid)}</dd>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <dt className="w-32 shrink-0 text-gray-500">Date de commande</dt>
              <dd className="text-white">
                {formatDateTime(order.createdAt)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white"
              style={{ background: gradient }}
            >
              {initial}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{productName}</h3>
              {productCategory && (
                <span className="rounded bg-[#1e1e1e] px-2 py-0.5 text-xs text-gray-400">
                  {productCategory}
                </span>
              )}
            </div>
          </div>
          {productDescription && (
            <p className="mt-4 text-sm text-gray-400">{productDescription}</p>
          )}

          {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
            <div className="mt-6">
              <h4 className="font-medium text-white">
                Que se passe-t-il maintenant ?
              </h4>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-gray-400">
                <li>Votre paiement a été confirmé ✅</li>
                <li>Le top-up est en cours de traitement ⏳</li>
                <li>Vous recevrez le code ou le crédit sous peu</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {productCategory && (
          <Link
            href={`/products?category=${productCategory}`}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#6366f1] px-4 text-sm font-medium text-white hover:bg-[#5558e3]"
          >
            Commander à nouveau
          </Link>
        )}
        <Link
          href="/orders"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-[#1e1e1e] px-4 text-sm font-medium text-gray-300 hover:bg-white/5"
        >
          Retour aux commandes
        </Link>
      </div>

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6">
        <h4 className="font-medium text-white">
          Besoin d&apos;aide avec cette commande ?
        </h4>
        <p className="mt-2 text-sm text-gray-400">
          En cas de problème ou de retard, contactez notre support.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Email:{' '}
          <a
            href="mailto:support@tunixo.tn"
            className="text-[#6366f1] hover:underline"
          >
            support@tunixo.tn
          </a>
        </p>
      </div>
    </div>
  )
}
