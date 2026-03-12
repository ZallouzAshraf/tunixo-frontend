'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/types'
import { formatTND } from '@/lib/utils'
import { useWalletBalance } from '@/hooks/useWallet'
import { useCreateOrder } from '@/hooks/useOrders'
import { useValidatePlayer } from '@/hooks/useTopup'
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
  product: Product
  isOpen: boolean
  onClose: () => void
}

type Step = 'player' | 'confirm' | 'success' | 'error'

export default function OrderModal({
  product,
  isOpen,
  onClose,
}: OrderModalProps) {
  const [step, setStep] = useState<Step>(
    product.serviceType === 'GIFTCARD' ? 'confirm' : 'player',
  )
  const [playerId, setPlayerId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [validatedUsername, setValidatedUsername] = useState('')
  const [resultOrder, setResultOrder] = useState<{
    status: string
    deliveredCode?: string
    failureReason?: string
  } | null>(null)

  const { data: walletData } = useWalletBalance()
  const createOrder = useCreateOrder()
  const validatePlayer = useValidatePlayer()
  const balance = walletData?.balance ?? 0
  const canAfford = balance >= product.priceTnd
  const balanceAfter = balance - product.priceTnd
  const isTopup = product.serviceType === 'TOPUP'
  const showZoneId = isTopup && product.category === 'pubg'

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
      resetState()
    }
  }

  function resetState() {
    setStep(isTopup ? 'player' : 'confirm')
    setPlayerId('')
    setZoneId('')
    setValidatedUsername('')
    setResultOrder(null)
    createOrder.reset()
    validatePlayer.reset()
  }

  useEffect(() => {
    if (!isOpen) resetState()
    if (isOpen && !isTopup) setStep('confirm')
  }, [isOpen, isTopup])

  const handleValidatePlayer = () => {
    if (!product.gameId || !playerId.trim()) return
    validatePlayer.mutate(
      {
        gameId: product.gameId,
        playerId: playerId.trim(),
        zoneId: zoneId.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          if (data.valid) {
            setValidatedUsername(data.username || 'Validé')
            setStep('confirm')
          }
        },
      },
    )
  }

  const handleConfirmOrder = () => {
    const payload: { productId: string; playerId?: string; zoneId?: string } = {
      productId: product.id,
    }
    if (isTopup) {
      payload.playerId = playerId.trim()
      if (zoneId.trim()) payload.zoneId = zoneId.trim()
    }
    createOrder.mutate(payload, {
      onSuccess: (data) => {
        const order = data.order
        setResultOrder({
          status: order.status,
          deliveredCode: order.deliveredCode,
          failureReason: order.failureReason,
        })
        setStep(
          order.status === 'FAILED' ? 'error' : 'success',
        )
      },
      onError: () => {
        setResultOrder({
          status: 'FAILED',
          failureReason: 'Erreur lors de la commande',
        })
        setStep('error')
      },
    })
  }

  const handleRetry = () => {
    setStep('player')
    setValidatedUsername('')
    setResultOrder(null)
    createOrder.reset()
  }

  if (step === 'success') {
    const isCompleted = resultOrder?.status === 'COMPLETED'
    const isProcessing = resultOrder?.status === 'PROCESSING'
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-md border-[#1e1e1e] bg-[#111111] text-white"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <span className="text-2xl">✅</span>
              {isCompleted
                ? 'Code livré! 🎁'
                : isProcessing
                  ? 'Top-up en cours! 🎮'
                  : 'Commande enregistrée'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isCompleted && resultOrder?.deliveredCode && (
              <div className="rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Votre code</p>
                <p className="text-xl font-bold tracking-widest text-white break-all">
                  {resultOrder.deliveredCode}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Utilisez ce code sur la plateforme concernée pour créditer votre compte.
                </p>
              </div>
            )}
            {isProcessing && (
              <p className="text-sm text-gray-400">
                Votre top-up est en cours de traitement. Vous recevrez une confirmation par email.
              </p>
            )}
          </div>
          <DialogFooter className="border-[#1e1e1e]">
            <Link
              href="/orders"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[#6366f1] px-4 text-sm font-medium text-white hover:bg-[#5558e3]"
            >
              Voir mes commandes
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  if (step === 'error') {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-md border-[#1e1e1e] bg-[#111111] text-white"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <span className="text-2xl">❌</span>
              Le top-up a échoué
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm text-gray-400">
            {resultOrder?.failureReason && (
              <p><strong className="text-gray-300">Raison :</strong> {resultOrder.failureReason}</p>
            )}
            <p className="text-green-400">Votre wallet a été remboursé automatiquement.</p>
          </div>
          <DialogFooter className="border-[#1e1e1e]">
            <Button
              variant="outline"
              onClick={handleRetry}
              className="border-[#1e1e1e] text-gray-400"
            >
              Réessayer
            </Button>
            <Button
              onClick={onClose}
              className="bg-[#6366f1] hover:bg-[#5558e3]"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  if (step === 'player' && isTopup) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-md border-[#1e1e1e] bg-[#111111] text-white"
          showCloseButton={!validatePlayer.isPending}
        >
          <DialogHeader>
            <DialogTitle className="text-white">
              Entrez votre Player ID
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="player-id" className="text-gray-300">
                Player ID *
              </Label>
              <Input
                id="player-id"
                type="text"
                placeholder="Ex: 1234567890"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="mt-1.5 border-[#1e1e1e] bg-[#0a0a0a] text-white placeholder:text-gray-500"
                disabled={validatePlayer.isPending}
              />
            </div>
            {showZoneId && (
              <div>
                <Label htmlFor="zone-id" className="text-gray-300">
                  Zone / Server ID (optionnel)
                </Label>
                <Input
                  id="zone-id"
                  type="text"
                  placeholder="Ex: 1"
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="mt-1.5 border-[#1e1e1e] bg-[#0a0a0a] text-white placeholder:text-gray-500"
                  disabled={validatePlayer.isPending}
                />
              </div>
            )}
            {validatePlayer.isError && (
              <p className="text-sm text-red-400">Player ID invalide. Vérifiez et réessayez.</p>
            )}
          </div>
          <DialogFooter className="border-[#1e1e1e]">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#1e1e1e] text-gray-400"
            >
              Annuler
            </Button>
            <Button
              onClick={handleValidatePlayer}
              disabled={!playerId.trim() || validatePlayer.isPending}
              className="bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50"
            >
              {validatePlayer.isPending ? (
                <LoadingSpinner size="sm" className="inline-block" />
              ) : (
                'Vérifier mon compte →'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md border-[#1e1e1e] bg-[#111111] text-white"
        showCloseButton={!createOrder.isPending}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            Confirmer la commande — {product.name}
          </DialogTitle>
          <p className="text-lg font-bold text-[#6366f1]">
            {formatTND(product.priceTnd)} TND
          </p>
        </DialogHeader>
        <div className="space-y-4">
          {isTopup && validatedUsername && (
            <p className="text-sm text-gray-400">
              Compte vérifié : <strong className="text-white">{validatedUsername}</strong>
            </p>
          )}
          <div className="rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] p-3 text-sm">
            <p className="text-gray-400">
              Votre solde : <span className="font-medium text-white">{formatTND(balance)} TND</span>
            </p>
            <p className="text-gray-400">
              Après achat : <span className="font-medium text-white">{formatTND(balanceAfter)} TND</span>
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
          {isTopup && (
            <Button
              variant="outline"
              onClick={() => setStep('player')}
              disabled={createOrder.isPending}
              className="border-[#1e1e1e] text-gray-400"
            >
              Retour
            </Button>
          )}
          <Button
            onClick={handleConfirmOrder}
            disabled={!canAfford || createOrder.isPending}
            className="bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50"
          >
            {createOrder.isPending ? (
              <LoadingSpinner size="sm" className="inline-block" />
            ) : (
              'Confirmer la commande'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
