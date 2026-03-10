'use client'

import { useState, useEffect } from 'react'
import type { Service } from '@/types'
import { formatTND } from '@/lib/utils'
import { useWalletBalance } from '@/hooks/useWallet'
import { useCreateOrder } from '@/hooks/useServices'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Link from 'next/link'

interface OrderModalProps {
  service: Service
  isOpen: boolean
  onClose: () => void
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export default function OrderModal({
  service,
  isOpen,
  onClose,
}: OrderModalProps) {
  const [serviceEmail, setServiceEmail] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const { data: walletData } = useWalletBalance()
  const createOrder = useCreateOrder()
  const balance = walletData?.balance ?? 0
  const canAfford = balance >= service.priceTnd
  const emailValid = isValidEmail(serviceEmail)
  const canSubmit = canAfford && emailValid && !createOrder.isPending

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
      setServiceEmail('')
      setShowConfirm(false)
      setOrderId(null)
      if (createOrder.isSuccess) {
        createOrder.reset()
      }
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setServiceEmail('')
      setShowConfirm(false)
      setOrderId(null)
      createOrder.reset()
    }
  }, [isOpen])

  const handleConfirmOrder = () => {
    if (!canSubmit) return
    setShowConfirm(true)
  }

  const handleSubmitOrder = () => {
    if (!emailValid || !canAfford) return
    createOrder.mutate(
      { serviceId: service.id, serviceEmail: serviceEmail.trim() },
      {
        onSuccess: (data: { order?: { id?: string } }) => {
          setOrderId(data?.order?.id ?? null)
          setShowConfirm(false)
        },
      }
    )
  }

  const handleClose = () => {
    onClose()
    setServiceEmail('')
    setShowConfirm(false)
    setOrderId(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md border-[#1e1e1e] bg-[#111111] text-white"
        showCloseButton={!createOrder.isPending}
      >
        {createOrder.isSuccess && orderId ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">
                ✅ Commande confirmée !
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm text-gray-400">
              <p>
                Votre commande #{orderId} est en traitement.
              </p>
              <p>
                Nous activerons votre abonnement <strong className="text-white">{service.name}</strong> sur{' '}
                <strong className="text-white">{serviceEmail}</strong> dans les prochaines heures.
              </p>
              <p>Vous recevrez un email de confirmation.</p>
            </div>
            <DialogFooter className="border-[#1e1e1e]">
              <Link
                href="/orders"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#6366f1] px-4 text-sm font-medium text-white hover:bg-[#5558e3]"
              >
                Voir mes commandes
              </Link>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">
                Commander — {service.name}
              </DialogTitle>
              <p className="text-lg font-bold text-[#6366f1]">
                {formatTND(service.priceTnd)} <span className="text-sm font-normal text-gray-500">/ mois</span>
              </p>
            </DialogHeader>

            {!showConfirm ? (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="order-email" className="text-gray-300">
                      Votre email sur {service.name}
                    </Label>
                    <Input
                      id="order-email"
                      type="email"
                      placeholder="ex: moncompte@gmail.com"
                      value={serviceEmail}
                      onChange={(e) => setServiceEmail(e.target.value)}
                      className="mt-1.5 border-[#1e1e1e] bg-[#0a0a0a] text-white placeholder:text-gray-500"
                      disabled={createOrder.isPending}
                    />
                  </div>

                  <div className="rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] p-3 text-sm">
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
                </div>

                <DialogFooter className="border-[#1e1e1e]">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-[#1e1e1e] text-gray-400"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleConfirmOrder}
                    disabled={!canSubmit}
                    className="bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50"
                  >
                    Confirmer la commande
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <div className="space-y-2 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] p-4 text-sm">
                  <p><span className="text-gray-500">Service :</span> {service.name}</p>
                  <p><span className="text-gray-500">Email :</span> {serviceEmail}</p>
                  <p><span className="text-gray-500">Montant :</span> {formatTND(service.priceTnd)}</p>
                </div>
                <p className="text-sm text-gray-400">Confirmer votre commande ?</p>
                <DialogFooter className="border-[#1e1e1e]">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    disabled={createOrder.isPending}
                    className="border-[#1e1e1e] text-gray-400"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={createOrder.isPending}
                    className="bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50"
                  >
                    {createOrder.isPending ? (
                      <LoadingSpinner size="sm" className="inline-block" />
                    ) : (
                      'Confirmer'
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
