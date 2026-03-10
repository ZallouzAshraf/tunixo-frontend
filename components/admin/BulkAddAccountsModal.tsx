'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Service } from '@/types'

type Format = 'email_password' | 'json'

function parseEmailPassword(text: string): {
  valid: Array<{ email: string; password: string }>
  invalidLines: Array<{ lineNum: number; content: string }>
} {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const valid: Array<{ email: string; password: string }> = []
  const invalidLines: Array<{ lineNum: number; content: string }> = []
  lines.forEach((line, i) => {
    const idx = line.indexOf(':')
    if (idx <= 0) {
      invalidLines.push({ lineNum: i + 1, content: line })
      return
    }
    const email = line.slice(0, idx).trim()
    const password = line.slice(idx + 1).trim()
    if (!email) {
      invalidLines.push({ lineNum: i + 1, content: line })
      return
    }
    valid.push({ email, password })
  })
  return { valid, invalidLines }
}

function parseJson(text: string): { valid: Record<string, unknown>[]; invalid: string } | null {
  try {
    const arr = JSON.parse(text)
    if (!Array.isArray(arr)) return null
    const valid: Record<string, unknown>[] = []
    for (const item of arr) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        valid.push(item as Record<string, unknown>)
      }
    }
    return { valid, invalid: '' }
  } catch {
    return null
  }
}

interface BulkAddAccountsModalProps {
  isOpen: boolean
  onClose: () => void
  services: Service[]
  preselectedServiceId?: string
  onSubmit: (payload: {
    serviceId: string
    accounts: Array<{ credentials: Record<string, unknown> }>
  }) => void
  isLoading?: boolean
}

export default function BulkAddAccountsModal({
  isOpen,
  onClose,
  services,
  preselectedServiceId,
  onSubmit,
  isLoading = false,
}: BulkAddAccountsModalProps) {
  const [serviceId, setServiceId] = useState(preselectedServiceId ?? '')
  useEffect(() => {
    if (isOpen && preselectedServiceId) setServiceId(preselectedServiceId)
  }, [isOpen, preselectedServiceId])
  const [format, setFormat] = useState<Format>('email_password')
  const [textarea, setTextarea] = useState('')

  const parsed = useMemo(() => {
    const t = textarea.trim()
    if (!t) return { count: 0, valid: [], invalidLines: [], error: null }
    if (format === 'email_password') {
      const { valid, invalidLines } = parseEmailPassword(t)
      return {
        count: valid.length,
        valid: valid.map((v) => ({ credentials: v })),
        invalidLines,
        error: null,
      }
    }
    const result = parseJson(t)
    if (!result) return { count: 0, valid: [], invalidLines: [], error: 'JSON invalide' }
    return {
      count: result.valid.length,
      valid: result.valid.map((v) => ({ credentials: v })),
      invalidLines: [],
      error: result.invalid || null,
    }
  }, [textarea, format])

  const canSubmit = serviceId && parsed.count > 0 && parsed.invalidLines.length === 0 && !parsed.error

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({
      serviceId,
      accounts: parsed.valid,
    })
    setTextarea('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Ajout en masse</DialogTitle>
          <DialogDescription>
            Importez plusieurs comptes en une seule fois.
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
            <Label>Format</Label>
            <div className="flex gap-1 rounded-lg border border-[#1e1e1e] bg-[#111111] p-1">
              <button
                type="button"
                onClick={() => setFormat('email_password')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  format === 'email_password' ? 'bg-[#6366f1] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                email:password
              </button>
              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  format === 'json' ? 'bg-[#6366f1] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                JSON
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bulk-content">
              {format === 'email_password' ? 'Comptes (un par ligne)' : 'JSON array'}
            </Label>
            <textarea
              id="bulk-content"
              value={textarea}
              onChange={(e) => setTextarea(e.target.value)}
              rows={8}
              placeholder={
                format === 'email_password'
                  ? 'compte1@tunixo.tn:password1\ncompte2@tunixo.tn:password2\ncompte3@tunixo.tn:password3'
                  : '[\n  {"email": "c1@tunixo.tn", "password": "pass1"},\n  {"email": "c2@tunixo.tn", "password": "pass2"}\n]'
              }
              className="w-full rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2 font-mono text-sm text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none"
            />
            {parsed.error && (
              <p className="text-sm text-red-400">{parsed.error}</p>
            )}
            {parsed.count > 0 && (
              <p className="text-sm text-green-400">
                ✅ {format === 'email_password'
                  ? `${parsed.count} compte${parsed.count !== 1 ? 's' : ''} valide${parsed.count !== 1 ? 's' : ''}`
                  : `${parsed.count} comptes détectés`}
              </p>
            )}
            {parsed.invalidLines.length > 0 && (
              <div className="text-sm text-red-400">
                <p>❌ {parsed.invalidLines.length} ligne{parsed.invalidLines.length !== 1 ? 's' : ''} invalide{parsed.invalidLines.length !== 1 ? 's' : ''}</p>
                {parsed.invalidLines.map(({ lineNum }) => (
                  <p key={lineNum} className="mt-1 text-xs">
                    Ligne {lineNum}: format invalide — attendu email:password
                  </p>
                ))}
              </div>
            )}
          </div>
          <DialogFooter showCloseButton={false} className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={!canSubmit || isLoading}>
              {isLoading ? 'Chargement...' : `Importer ${parsed.count} comptes`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
