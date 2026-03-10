'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Service } from '@/types'

interface AddAccountModalProps {
  isOpen: boolean
  onClose: () => void
  services: Service[]
  preselectedServiceId?: string
  onSubmit: (payload: {
    serviceId: string
    credentials: Record<string, unknown>
    accountEmail?: string
  }) => void
  isLoading?: boolean
}

export default function AddAccountModal({
  isOpen,
  onClose,
  services,
  preselectedServiceId,
  onSubmit,
  isLoading = false,
}: AddAccountModalProps) {
  const [serviceId, setServiceId] = useState(preselectedServiceId ?? '')
  const [accountEmail, setAccountEmail] = useState('')
  useEffect(() => {
    if (isOpen && preselectedServiceId) setServiceId(preselectedServiceId)
  }, [isOpen, preselectedServiceId])
  const [jsonPreviewOpen, setJsonPreviewOpen] = useState(false)
  const [credRows, setCredRows] = useState<Array<{ key: string; value: string }>>([
    { key: 'email', value: '' },
    { key: 'password', value: '' },
  ])

  const credentials: Record<string, unknown> = {}
  credRows.forEach((r) => {
    if (r.key.trim()) credentials[r.key.trim()] = r.value
  })

  const validJson = Object.keys(credentials).length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceId.trim()) return
    if (!validJson) return
    onSubmit({
      serviceId,
      credentials,
      accountEmail: accountEmail.trim() || undefined,
    })
    setAccountEmail('')
    setCredRows([{ key: 'email', value: '' }, { key: 'password', value: '' }])
    onClose()
  }

  const addRow = () => setCredRows((r) => [...r, { key: '', value: '' }])
  const removeRow = (i: number) =>
    setCredRows((r) => r.filter((_, index) => index !== i))
  const updateRow = (i: number, field: 'key' | 'value', val: string) =>
    setCredRows((r) => {
      const next = [...r]
      next[i] = { ...next[i], [field]: val }
      return next
    })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Ajouter un compte au stock</DialogTitle>
          <DialogDescription>
            Choisissez le service et renseignez les identifiants du compte.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Service</Label>
            <Select
              value={serviceId || (preselectedServiceId ?? '')}
              onValueChange={(v) => setServiceId(v ?? '')}
            >
              <SelectTrigger className="w-full border-[#1e1e1e] bg-[#111111] text-white">
                <SelectValue placeholder="Choisir un service..." />
              </SelectTrigger>
              <SelectContent className="border-[#1e1e1e] bg-[#111111]">
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-white">
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountEmail">Email du compte (optionnel)</Label>
            <Input
              id="accountEmail"
              type="email"
              value={accountEmail}
              onChange={(e) => setAccountEmail(e.target.value)}
              placeholder="compte@tunixo.tn"
              className="bg-[#111111] border-[#1e1e1e] text-white"
            />
            <p className="text-xs text-gray-500">Pour identifier le compte dans le stock.</p>
          </div>
          <div className="space-y-2">
            <Label>Credentials</Label>
            {credRows.map((row, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={row.key}
                  onChange={(e) => updateRow(i, 'key', e.target.value)}
                  placeholder="Clé"
                  className="flex-1 bg-[#111111] border-[#1e1e1e] text-white"
                />
                <Input
                  value={row.value}
                  onChange={(e) => updateRow(i, 'value', e.target.value)}
                  placeholder="Valeur"
                  className="flex-1 bg-[#111111] border-[#1e1e1e] text-white"
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="rounded p-1 text-gray-400 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="text-sm text-[#6366f1] hover:underline"
            >
              + Ajouter un champ
            </button>
          </div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setJsonPreviewOpen((o) => !o)}
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
            >
              <span>{jsonPreviewOpen ? '▼' : '▶'}</span>
              Aperçu JSON
            </button>
            {jsonPreviewOpen && (
              <div className="rounded-lg bg-[#1e1e1e] p-2 font-mono text-xs text-gray-400">
                <pre>{JSON.stringify(credentials, null, 2)}</pre>
              </div>
            )}
          </div>
          <DialogFooter showCloseButton={false} className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !serviceId || !validJson}>
              {isLoading ? 'Chargement...' : 'Ajouter au stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
