'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { differenceInDays } from 'date-fns'
import { useOrder, useCancelOrder } from '@/hooks/useOrders'
import { formatTND, formatDate, formatDateTime } from '@/lib/utils'
import OrderStatus from '@/components/orders/OrderStatus'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

function getGradientFromName(name: string): string {
  const hues = [250, 270, 300, 330, 200]
  const index = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length
  const h = hues[index]
  return `linear-gradient(135deg, hsl(${h}, 60%, 25%) 0%, hsl(${h + 30}, 50%, 35%) 100%)`
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    toast.success('Copié')
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded border border-[#1e1e1e] bg-[#111111] px-2 py-1 text-xs text-gray-400 hover:text-white"
    >
      {copied ? 'Copié !' : label}
    </button>
  )
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const { data: order, isLoading, isError } = useOrder(id)
  const cancelOrder = useCancelOrder()
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    if (isError || (!isLoading && !order)) {
      router.replace('/orders')
    }
  }, [id, isError, isLoading, order, router])

  const handleCancelConfirm = () => {
    if (!order) return
    cancelOrder.mutate(order.id, {
      onSuccess: () => {
        toast.success(
          `Commande annulée — ${formatTND(order.amountPaid)} remboursé`
        )
        setCancelDialogOpen(false)
        router.replace('/orders')
      },
      onError: () => toast.error('Impossible d\'annuler la commande'),
    })
  }

  if (!id || isLoading || isError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!order) return null

  const serviceName = order.service?.name ?? 'Service'
  const serviceSlug = order.service?.slug ?? ''
  const serviceCategory = order.service?.category
  const serviceDescription = order.service?.description
  const gradient = getGradientFromName(serviceName)
  const initial = serviceName.charAt(0).toUpperCase()
  const shortId = order.id.length > 8 ? order.id.slice(-8) : order.id
  const expiresAt = order.expiresAt ? new Date(order.expiresAt) : null
  const expiresSoon =
    expiresAt && differenceInDays(expiresAt, new Date()) < 5

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
        serviceEmail={order.serviceEmail}
        serviceName={serviceName}
        serviceSlug={serviceSlug}
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
              <dt className="w-32 shrink-0 text-gray-500">Service</dt>
              <dd className="text-white">{serviceName}</dd>
            </div>
            {order.serviceEmail && (
              <div className="flex flex-wrap items-center gap-2">
                <dt className="w-32 shrink-0 text-gray-500">Email activé</dt>
                <dd className="flex items-center gap-2 text-white">
                  {order.serviceEmail}
                  <CopyButton value={order.serviceEmail} label="Copier" />
                </dd>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <dt className="w-32 shrink-0 text-gray-500">Statut</dt>
              <dd>
                <StatusBadge status={order.status} />
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
            {order.expiresAt && (
              <div className="flex flex-wrap items-center gap-2">
                <dt className="w-32 shrink-0 text-gray-500">
                  Date d&apos;expiration
                </dt>
                <dd
                  className={
                    expiresSoon ? 'text-red-400' : 'text-white'
                  }
                >
                  {formatDate(order.expiresAt)}
                </dd>
              </div>
            )}
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
              <h3 className="text-xl font-bold text-white">{serviceName}</h3>
              {serviceCategory && (
                <span className="rounded bg-[#1e1e1e] px-2 py-0.5 text-xs text-gray-400">
                  {serviceCategory}
                </span>
              )}
            </div>
          </div>
          {serviceDescription && (
            <p className="mt-4 text-sm text-gray-400">{serviceDescription}</p>
          )}

          {order.status === 'ACTIVE' && order.serviceEmail && (
            <div className="mt-6">
              <h4 className="font-medium text-white">
                Comment accéder à votre service
              </h4>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-gray-400">
                <li>Allez sur le site de {serviceName}</li>
                <li>Connectez-vous avec {order.serviceEmail}</li>
                <li>Profitez de votre abonnement !</li>
              </ol>
            </div>
          )}

          {order.status === 'PENDING' && (
            <div className="mt-6">
              <h4 className="font-medium text-white">
                Que se passe-t-il maintenant ?
              </h4>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-gray-400">
                <li>Votre paiement a été confirmé ✅</li>
                <li>Notre équipe active votre abonnement ⏳</li>
                <li>Vous recevrez un email de confirmation</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {order.status === 'PENDING' && (
          <Button
            variant="destructive"
            onClick={() => setCancelDialogOpen(true)}
            disabled={cancelOrder.isPending}
          >
            Annuler la commande
          </Button>
        )}
        {order.status === 'ACTIVE' && expiresSoon && serviceSlug && (
          <Link
            href={`/services/${serviceSlug}`}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#6366f1] px-4 text-sm font-medium text-white hover:bg-[#5558e3]"
          >
            Renouveler maintenant
          </Link>
        )}
        {order.status === 'EXPIRED' && serviceSlug && (
          <Link
            href={`/services/${serviceSlug}`}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#6366f1] px-4 text-sm font-medium text-white hover:bg-[#5558e3]"
          >
            Commander à nouveau
          </Link>
        )}
      </div>

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6">
        <h4 className="font-medium text-white">
          Besoin d&apos;aide avec cette commande ?
        </h4>
        <p className="mt-2 text-sm text-gray-400">
          Si votre abonnement n&apos;est pas activé après 2 heures, contactez
          notre support.
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

      <ConfirmDialog
        isOpen={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Annuler la commande"
        description="Êtes-vous sûr de vouloir annuler cette commande ? Le montant vous sera remboursé sur votre wallet."
        confirmText="Annuler la commande"
        isLoading={cancelOrder.isPending}
      />
    </div>
  )
}
