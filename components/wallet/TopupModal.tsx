'use client'

import { useState, useEffect } from 'react'
import { useTopup } from '@/hooks/useWallet'
import { formatTND } from '@/lib/utils'
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

const QUICK_AMOUNTS = [20, 50, 100, 200]
const MIN_AMOUNT = 5

interface TopupModalProps {
  isOpen: boolean
  onClose: () => void
  defaultAmount?: number
}

export default function TopupModal({
  isOpen,
  onClose,
  defaultAmount = 20,
}: TopupModalProps) {
  const [amount, setAmount] = useState(defaultAmount)
  const topup = useTopup()

  useEffect(() => {
    if (isOpen) {
      setAmount(defaultAmount >= MIN_AMOUNT ? defaultAmount : MIN_AMOUNT)
    }
  }, [isOpen, defaultAmount])

  const validAmount = amount >= MIN_AMOUNT
  const canSubmit = validAmount && !topup.isPending

  const handleSubmit = () => {
    if (!canSubmit) return
    topup.mutate(
      { amount, description: 'Wallet top-up' },
      {
        onSuccess: (data) => {
          const url = data?.payUrl
          if (url && typeof url === 'string') {
            window.location.href = url
          }
          onClose()
        },
      }
    )
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md border-[#1e1e1e] bg-[#111111] text-white"
        showCloseButton={!topup.isPending}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            Recharger mon wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="topup-amount" className="text-gray-300">
              Montant à recharger (TND)
            </Label>
            <Input
              id="topup-amount"
              type="number"
              min={MIN_AMOUNT}
              step={1}
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mt-1.5 border-[#1e1e1e] bg-[#0a0a0a] text-white"
              disabled={topup.isPending}
            />
            <p className="mt-1 text-xs text-gray-500">Minimum 5 TND</p>
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-400">Montant rapide</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmount(a)}
                  disabled={topup.isPending}
                  className="rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-[#6366f1]/50 disabled:opacity-50"
                >
                  {a} TND
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] p-3 text-sm">
            <p className="text-gray-400">
              Vous allez recharger : <span className="font-semibold text-white">{formatTND(amount)}</span>
            </p>
            <p className="mt-1 text-gray-500">Via : Konnect (D17, carte bancaire)</p>
          </div>
        </div>

        <DialogFooter className="border-[#1e1e1e]">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={topup.isPending}
            className="border-[#1e1e1e] text-gray-400"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50"
          >
            {topup.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2 inline-block" />
                Redirection...
              </>
            ) : (
              'Procéder au paiement'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
