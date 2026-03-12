'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Order } from '@/types'
import { formatTND, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/common/StatusBadge'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CATEGORIES } from '@/lib/constants'

function getCategoryEmoji(category: string): string {
  const found = CATEGORIES.find((c) => c.id === category)
  return found?.emoji ?? '🎮'
}

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  const productName = order.product?.name ?? 'Produit'
  const productCategory = order.product?.category ?? ''
  const emoji = getCategoryEmoji(productCategory)
  const [showCodeModal, setShowCodeModal] = useState(false)

  const isCompleted = order.status === 'COMPLETED'
  const isProcessing =
    order.status === 'PENDING' || order.status === 'PROCESSING'
  const isFailed = order.status === 'FAILED'
  const isGiftCard = order.product?.serviceType === 'GIFTCARD'
  const canShowCode = isCompleted && isGiftCard && order.deliveredCode

  const borderClass = isCompleted
    ? 'border-l-green-500'
    : isProcessing
      ? 'border-l-blue-500'
      : isFailed
        ? 'border-l-red-500'
        : 'border-l-yellow-500'

  return (
    <>
      <div
        className={cn(
          'rounded-xl border border-[#1e1e1e] border-l-4 bg-[#111111] p-4',
          borderClass,
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1e1e1e] text-xl">
              {emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-white">{productName}</span>
                <StatusBadge status={order.status} />
              </div>
              {order.playerId && (
                <p className="mt-1 text-sm text-gray-400">
                  Player ID: {order.playerId}
                </p>
              )}
              {isFailed && order.failureReason && (
                <p className="mt-1 text-sm text-red-400">
                  {order.failureReason}
                </p>
              )}
              <p className="mt-1 text-sm text-[#6366f1]">
                Montant: {formatTND(order.amountPaid)} TND
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Commandé le: {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href={`/orders/${order.id}`}
              className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2 text-sm font-medium text-white hover:bg-[#1e1e1e]"
            >
              Voir détails
            </Link>
            {canShowCode && (
              <button
                type="button"
                onClick={() => setShowCodeModal(true)}
                className="rounded-lg bg-green-500/20 px-3 py-2 text-sm font-medium text-green-400 hover:bg-green-500/30"
              >
                🎁 Code livré
              </button>
            )}
          </div>
        </div>

        {isProcessing && (
          <p className="mt-3 rounded-lg bg-blue-500/5 px-3 py-2 text-sm text-blue-200/90">
            ⏳ Votre commande est en cours de traitement.
          </p>
        )}
        {isCompleted && !isGiftCard && (
          <p className="mt-3 text-sm text-green-400/90">
            ✅ Top-up effectué
          </p>
        )}
      </div>

      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent
          className="max-w-md border-[#1e1e1e] bg-[#111111] text-white"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle className="text-white">
              Code cadeau — {productName}
            </DialogTitle>
          </DialogHeader>
          {order.deliveredCode && (
            <div className="rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] p-4 text-center">
              <p className="text-xl font-bold tracking-widest text-white break-all">
                {order.deliveredCode}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Utilisez ce code sur la plateforme concernée.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
