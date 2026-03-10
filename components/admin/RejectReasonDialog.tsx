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

interface RejectReasonDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  title: string
  description: string
  confirmText?: string
  isLoading?: boolean
}

export default function RejectReasonDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Rejeter',
  isLoading = false,
}: RejectReasonDialogProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    const trimmed = reason.trim()
    if (!trimmed) return
    onConfirm(trimmed)
    setReason('')
  }

  const handleClose = () => {
    setReason('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Raison (obligatoire)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Preuve de paiement invalide"
            className="w-full rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2 text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none"
          />
        </div>
        <DialogFooter showCloseButton={false} className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? 'Chargement...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
