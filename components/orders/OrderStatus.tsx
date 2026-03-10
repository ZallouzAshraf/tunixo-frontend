'use client'

import Link from 'next/link'

interface OrderStatusProps {
  status: string
  serviceEmail?: string
  serviceName?: string
  serviceSlug?: string
}

export default function OrderStatus({
  status,
  serviceEmail = '',
  serviceName = '',
  serviceSlug = '',
}: OrderStatusProps) {
  const upper = status.toUpperCase()

  if (upper === 'PENDING') {
    return (
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-4 text-yellow-200">
        <p className="font-medium">⏳ Commande en cours de traitement</p>
        <p className="mt-1 text-sm text-yellow-200/90">
          Notre équipe active votre abonnement sur {serviceEmail || 'votre email'}.
          Délai estimé: moins d&apos;1 heure.
        </p>
      </div>
    )
  }

  if (upper === 'ACTIVE') {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-4 text-green-200">
        <p className="font-medium">✅ Abonnement actif</p>
        <p className="mt-1 text-sm text-green-200/90">
          Votre abonnement {serviceName || 'ce service'} est actif sur {serviceEmail || 'votre email'}.
        </p>
      </div>
    )
  }

  if (upper === 'FAILED') {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-red-200">
        <p className="font-medium">❌ Commande échouée</p>
        <p className="mt-1 text-sm text-red-200/90">
          Un problème est survenu. Contactez notre support.
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

  if (upper === 'EXPIRED') {
    return (
      <div className="rounded-xl border border-gray-500/30 bg-gray-500/10 px-4 py-4 text-gray-300">
        <p className="font-medium">⌛ Abonnement expiré</p>
        <p className="mt-1 text-sm text-gray-400">
          Renouvelez pour continuer à profiter de {serviceName || 'ce service'}.
        </p>
        {serviceSlug && (
          <Link
            href={`/services/${serviceSlug}`}
            className="mt-3 inline-flex h-8 items-center rounded-lg bg-[#6366f1] px-3 text-sm font-medium text-white hover:bg-[#5558e3]"
          >
            Renouveler
          </Link>
        )}
      </div>
    )
  }

  return null
}
