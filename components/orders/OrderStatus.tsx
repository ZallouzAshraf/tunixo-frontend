'use client'

import Link from 'next/link'

interface OrderStatusProps {
  status: string
  productName?: string
  productCategory?: string
  playerUsername?: string
  failureReason?: string
}

export default function OrderStatus({
  status,
  productName = '',
  productCategory = '',
  playerUsername,
  failureReason,
}: OrderStatusProps) {
  const upper = status.toUpperCase()

  if (upper === 'PENDING') {
    return (
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-4 text-yellow-200">
        <p className="font-medium">⏳ Paiement reçu</p>
        <p className="mt-1 text-sm text-yellow-200/90">
          Votre commande est en file. Le top-up sera traité sous peu.
        </p>
      </div>
    )
  }

  if (upper === 'PROCESSING') {
    return (
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-4 text-blue-200">
        <p className="font-medium">🔄 Top-up en cours</p>
        <p className="mt-1 text-sm text-blue-200/90">
          Votre commande est en cours de traitement.
        </p>
      </div>
    )
  }

  if (upper === 'COMPLETED') {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-4 text-green-200">
        <p className="font-medium">✅ Livré</p>
        <p className="mt-1 text-sm text-green-200/90">
          {productName ? `${productName} — livraison effectuée.` : 'Commande livrée.'}
        </p>
        {productCategory && (
          <Link
            href={`/products?category=${productCategory}`}
            className="mt-3 inline-flex h-8 items-center rounded-lg bg-[#6366f1] px-3 text-sm font-medium text-white hover:bg-[#5558e3]"
          >
            Commander à nouveau
          </Link>
        )}
      </div>
    )
  }

  if (upper === 'FAILED') {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-red-200">
        <p className="font-medium">❌ Top-up échoué</p>
        <p className="mt-1 text-sm text-red-200/90">
          {failureReason || 'Un problème est survenu. Votre wallet a été remboursé.'}
        </p>
        <a
          href="mailto:support@tunixo.tn"
          className="mt-3 inline-flex h-8 items-center rounded-lg border border-red-400/50 px-3 text-sm text-red-200 hover:bg-red-500/20"
        >
          Contacter le support
        </a>
      </div>
    )
  }

  if (upper === 'REFUNDED') {
    return (
      <div className="rounded-xl border border-gray-500/30 bg-gray-500/10 px-4 py-4 text-gray-300">
        <p className="font-medium">↩️ Remboursé</p>
        <p className="mt-1 text-sm text-gray-400">
          Le montant a été recrédité sur votre wallet.
        </p>
        <Link
          href="/products"
          className="mt-3 inline-flex h-8 items-center rounded-lg bg-[#6366f1] px-3 text-sm font-medium text-white hover:bg-[#5558e3]"
        >
          Voir les offres
        </Link>
      </div>
    )
  }

  return null
}
