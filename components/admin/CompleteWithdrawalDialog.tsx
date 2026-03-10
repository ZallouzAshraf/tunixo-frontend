'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CompleteWithdrawalDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (note?: string) => void
  sellerName: string
  amountTnd: number
  method: string
  isLoading?: boolean
}

export default function CompleteWithdrawalDialog({
  isOpen,
  onClose,
  onConfirm,
  sellerName,
  amountTnd,
  method,
  isLoading = false,
}: CompleteWithdrawalDialogProps) {
  const [note, setNote] = useState('')

  const handleConfirm = () => {
    onConfirm(note.trim() || undefined)
    setNote('')
  }

  const handleClose = () => {
    setNote('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Confirmer l&apos;envoi</DialogTitle>
          <DialogDescription>
            Confirmez que vous avez envoyé {amountTnd.toFixed(3)} TND à {sellerName} via {method}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Note (optionnel)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Référence de virement, etc."
            className="w-full rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2 text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none"
          />
        </div>
        <DialogFooter showCloseButton={false} className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : "Confirmer l'envoi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
