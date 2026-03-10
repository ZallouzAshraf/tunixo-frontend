'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { useService, useCreateOrder } from '@/hooks/useServices'
import { useWalletBalance } from '@/hooks/useWallet'
import { formatTND } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

function getGradientFromName(name: string): string {
  const hues = [250, 270, 300, 330, 200]
  const index = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length
  const h = hues[index]
  return `linear-gradient(135deg, hsl(${h}, 60%, 25%) 0%, hsl(${h + 30}, 50%, 35%) 100%)`
}

function getStockLabel(stockCount: number | undefined): { text: string; className: string } {
  if (stockCount === undefined || stockCount === null || stockCount === 0) {
    return { text: '📋 Sur commande', className: 'bg-gray-500/10 text-gray-400' }
  }
  if (stockCount <= 5) {
    return { text: '⚠️ Stock limité', className: 'bg-yellow-500/10 text-yellow-500' }
  }
  return { text: '✅ Disponible', className: 'bg-green-500/10 text-green-500' }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export default function ServiceDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const { data: service, isLoading, isError } = useService(slug)
  const { data: walletData } = useWalletBalance()
  const balance = walletData?.balance ?? 0

  const [serviceEmail, setServiceEmail] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: string } | null>(null)

  const createOrderMutation = useCreateOrder()

  const canAfford = service ? balance >= service.priceTnd : false
  const emailValid = isValidEmail(serviceEmail)
  const canSubmit = !!service && canAfford && emailValid && !createOrderMutation.isPending
  const stock = service ? getStockLabel(service.stockCount) : null

  const handleConfirmOrder = () => {
    if (!canSubmit || !service) return
    setShowConfirm(true)
  }

  const handleSubmitOrder = () => {
    if (!service || !emailValid || !canAfford) return
    createOrderMutation.mutate(
      { serviceId: service.id, serviceEmail: serviceEmail.trim() },
      {
        onSuccess: (data: { order?: { id?: string } }) => {
          setOrderSuccess({ orderId: data?.order?.id ?? '' })
          setShowConfirm(false)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !service) {
    return (
      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-8 text-center">
        <p className="text-gray-400">Service introuvable.</p>
        <Link href="/services" className="mt-4 inline-block text-[#6366f1] hover:underline">
          Retour aux services
        </Link>
      </div>
    )
  }

  const gradient = getGradientFromName(service.name)
  const initial = (service.name || 'S').charAt(0).toUpperCase()

  if (orderSuccess) {
    return (
      <div className="space-y-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/services" className="hover:text-white">Services</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">{service.name}</span>
        </nav>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-8">
          <h2 className="text-xl font-bold text-white">✅ Commande confirmée !</h2>
          <p className="mt-2 text-gray-400">
            Votre commande #{orderSuccess.orderId} est en traitement.
          </p>
          <p className="mt-2 text-gray-400">
            Nous activerons votre abonnement <strong className="text-white">{service.name}</strong> sur{' '}
            <strong className="text-white">{serviceEmail}</strong> dans les prochaines heures.
          </p>
          <p className="mt-2 text-gray-400">Vous recevrez un email de confirmation.</p>
          <Link
            href="/orders"
            className="mt-6 inline-flex rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
          >
            Voir mes commandes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/services" className="hover:text-white">Services</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{service.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
        <div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div
              className="h-20 w-20 shrink-0 rounded-xl"
              style={{
                background: service.imageUrl ? `url(${service.imageUrl}) center/cover` : gradient,
              }}
            >
              {!service.imageUrl && (
                <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-white/80">
                  {initial}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{service.name}</h1>
              {service.category && (
                <span className="mt-2 inline-block rounded bg-[#1e1e1e] px-2 py-0.5 text-xs text-gray-400">
                  {service.category}
                </span>
              )}
              {service.description && (
                <p className="mt-3 text-gray-400">{service.description}</p>
              )}
              <p className="mt-3 text-xl font-bold text-[#6366f1]">
                {formatTND(service.priceTnd)} <span className="text-sm font-normal text-gray-500">/ mois</span>
              </p>
              {stock && (
                <span className={`mt-2 inline-block rounded px-2 py-0.5 text-xs ${stock.className}`}>
                  {stock.text}
                </span>
              )}
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-[#1e1e1e] bg-[#111111] p-6">
            <h3 className="mb-4 font-semibold text-white">Comment ça marche</h3>
            <ol className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366f1]/20 text-xs font-bold text-[#6366f1]">1</span>
                Vous payez en TND — votre wallet est débité.
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366f1]/20 text-xs font-bold text-[#6366f1]">2</span>
                Nous activons votre abonnement sur votre compte existant.
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366f1]/20 text-xs font-bold text-[#6366f1]">3</span>
                Vous recevez une confirmation par email sous 1h.
              </li>
            </ol>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6">
            <h2 className="text-lg font-semibold text-white">Commander maintenant</h2>
            <p className="mt-1 text-xl font-bold text-[#6366f1]">{formatTND(service.priceTnd)}</p>
            <p className="text-sm text-gray-500">/ mois — Paiement en TND local</p>

            {!showConfirm ? (
              <>
                <div className="mt-6">
                  <Label htmlFor="detail-email" className="text-gray-300">
                    Votre email sur {service.name}
                  </Label>
                  <Input
                    id="detail-email"
                    type="email"
                    placeholder="ex: moncompte@gmail.com"
                    value={serviceEmail}
                    onChange={(e) => setServiceEmail(e.target.value)}
                    className="mt-1.5 border-[#1e1e1e] bg-[#0a0a0a] text-white placeholder:text-gray-500"
                    disabled={createOrderMutation.isPending}
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    Entrez l&apos;email de votre compte {service.name} existant. L&apos;abonnement sera activé sur ce compte.
                  </p>
                </div>

                <div className="mt-4 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] p-3 text-sm">
                  <p className="text-gray-400">
                    Votre solde : <span className="font-medium text-white">{formatTND(balance)}</span>
                  </p>
                  {!canAfford && (
                    <p className="mt-1 text-amber-400">
                      Solde insuffisant —{' '}
                      <Link href="/wallet" className="text-[#6366f1] underline">
                        Recharger mon wallet
                      </Link>
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleConfirmOrder}
                  disabled={!canSubmit}
                  className="mt-4 w-full bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50"
                >
                  Confirmer la commande
                </Button>
              </>
            ) : (
              <>
                <div className="mt-6 space-y-2 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] p-4 text-sm">
                  <p><span className="text-gray-500">Service :</span> {service.name}</p>
                  <p><span className="text-gray-500">Email :</span> {serviceEmail}</p>
                  <p><span className="text-gray-500">Montant :</span> {formatTND(service.priceTnd)}</p>
                </div>
                <p className="mt-4 text-sm text-gray-400">Confirmer votre commande ?</p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    disabled={createOrderMutation.isPending}
                    className="flex-1 border-[#1e1e1e] text-gray-400"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={createOrderMutation.isPending}
                    className="flex-1 bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50"
                  >
                    {createOrderMutation.isPending ? (
                      <LoadingSpinner size="sm" className="inline-block" />
                    ) : (
                      'Confirmer'
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
