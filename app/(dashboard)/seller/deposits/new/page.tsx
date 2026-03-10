'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCurrentUser } from '@/hooks/useAuth'
import { useCreateDeposit } from '@/hooks/useDeposits'
import { formatTND } from '@/lib/utils'
import { EXCHANGE_RATE, SELLER_COMMISSION, MIN_DEPOSIT_USD } from '@/lib/constants'
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
const METHOD_LABELS: Record<string, string> = {
  PAYPAL: 'PayPal',
  FIVERR: 'Fiverr',
  UPWORK: 'Upwork',
  WISE: 'Wise',
  OTHER: 'Autre',
}

const depositSchema = z.object({
  amountUsd: z.number().min(MIN_DEPOSIT_USD, `Minimum $${MIN_DEPOSIT_USD}`),
  paymentMethod: z.enum(['PAYPAL', 'FIVERR', 'UPWORK', 'WISE', 'OTHER']),
  proofUrl: z.string().url('URL invalide').min(1, 'Requis'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof depositSchema>

function tndReceived(amountUsd: number): number {
  return amountUsd * (1 - SELLER_COMMISSION) * EXCHANGE_RATE
}

export default function NewDepositPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useCurrentUser()
  const [success, setSuccess] = useState<FormData | null>(null)
  const createDeposit = useCreateDeposit()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amountUsd: MIN_DEPOSIT_USD,
      paymentMethod: 'PAYPAL',
      proofUrl: '',
      notes: '',
    },
  })

  const amountUsd = watch('amountUsd')
  const paymentMethod = watch('paymentMethod')
  const amountNum = Number(amountUsd) || 0
  const commissionAmount = amountNum * SELLER_COMMISSION
  const tnd = tndReceived(amountNum)

  useEffect(() => {
    if (authLoading) return
    if (user && user.role !== 'SELLER') router.replace('/dashboard')
  }, [user, authLoading, router])

  const onSubmit = (data: FormData) => {
    createDeposit.mutate(
      {
        amountUsd: data.amountUsd,
        paymentMethod: data.paymentMethod,
        proofUrl: data.proofUrl,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          setSuccess(data)
        },
        onError: () => {},
      }
    )
  }

  if (authLoading) return null
  if (!user || user.role !== 'SELLER') return null

  if (success) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <nav className="text-sm text-gray-400">
          <Link href="/seller/deposits" className="hover:text-white">
            Mes dépôts
          </Link>
          <span className="mx-2">›</span>
          <span className="text-white">Nouveau dépôt</span>
        </nav>
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
          <p className="text-2xl">✅</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Dépôt soumis avec succès !
          </h2>
          <div className="mt-4 rounded-lg bg-[#111111] p-4 text-left">
            <p className="text-sm text-gray-400">
              Montant: ${success.amountUsd.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">
              Méthode: {METHOD_LABELS[success.paymentMethod] ?? success.paymentMethod}
            </p>
            <p className="text-sm text-gray-400">
              TND estimé: {formatTND(tndReceived(success.amountUsd))}
            </p>
            <p className="text-sm text-gray-400">Statut: En attente</p>
          </div>
          <p className="mt-4 text-sm text-gray-300">
            Notre équipe validera votre dépôt sous 24h. Vous recevrez un email de
            confirmation.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/seller/deposits"
              className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
            >
              Voir mes dépôts
            </Link>
            <Link
              href="/seller"
              className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e1e1e]"
            >
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <nav className="text-sm text-gray-400">
        <Link href="/seller/deposits" className="hover:text-white">
          Mes dépôts
        </Link>
        <span className="mx-2">›</span>
        <span className="text-white">Nouveau dépôt</span>
      </nav>

      <div className="rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/5 p-4">
        <p className="font-medium text-white">💡 Comment ça marche</p>
        <p className="mt-1 text-sm text-gray-300">
          Soumettez le montant disponible sur votre compte PayPal/Fiverr. Notre
          équipe validera votre dépôt sous 24h et créditera votre wallet en TND.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amountUsd">Montant à déposer (USD)</Label>
          <Input
            id="amountUsd"
            type="number"
            step="0.01"
            min={MIN_DEPOSIT_USD}
            {...register('amountUsd', { valueAsNumber: true })}
            className="bg-[#111111] border-[#1e1e1e] text-white"
          />
          <p className="text-xs text-gray-500">Minimum ${MIN_DEPOSIT_USD}</p>
          <p className="text-sm text-gray-400">
            ≈ {formatTND(tnd)} (Taux: 1$ = {EXCHANGE_RATE} TND)
          </p>
          {errors.amountUsd && (
            <p className="text-sm text-red-400">{errors.amountUsd.message}</p>
          )}
          <p className="text-xs text-gray-500">Commission plateforme: 5% déduite</p>
        </div>

        <div className="rounded-lg border border-[#1e1e1e] bg-[#111111] p-4">
          <p className="text-sm text-gray-400">
            Vous déposez <span className="font-semibold text-white">${amountNum.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-400">
            Commission (5%) <span className="text-red-400">-${commissionAmount.toFixed(2)}</span>
          </p>
          <hr className="my-2 border-[#1e1e1e]" />
          <p className="text-sm font-semibold text-[#6366f1]">
            Vous recevez {formatTND(tnd)}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Source du paiement</Label>
          <Select
            value={paymentMethod}
            onValueChange={(v) => setValue('paymentMethod', v as FormData['paymentMethod'])}
          >
            <SelectTrigger className="w-full border-[#1e1e1e] bg-[#111111] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[#1e1e1e] bg-[#111111]">
              <SelectItem value="PAYPAL" className="text-white">💙 PayPal</SelectItem>
              <SelectItem value="FIVERR" className="text-white">🟢 Fiverr</SelectItem>
              <SelectItem value="UPWORK" className="text-white">🔵 Upwork</SelectItem>
              <SelectItem value="WISE" className="text-white">💳 Wise</SelectItem>
              <SelectItem value="OTHER" className="text-white">❓ Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="proofUrl">Lien vers la preuve de paiement</Label>
          <Input
            id="proofUrl"
            type="url"
            {...register('proofUrl')}
            placeholder="https://drive.google.com/... ou https://imgur.com/..."
            className="bg-[#111111] border-[#1e1e1e] text-white"
          />
          <p className="text-xs text-gray-500">
            Uploadez une capture d&apos;écran sur Google Drive ou Imgur et collez le lien ici
          </p>
          {errors.proofUrl && (
            <p className="text-sm text-red-400">{errors.proofUrl.message}</p>
          )}
          {watch('proofUrl') && (
            <a
              href={watch('proofUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#6366f1] hover:underline"
            >
              Voir le lien →
            </a>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes supplémentaires (optionnel)</Label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            placeholder="Informations supplémentaires pour notre équipe..."
            className="w-full rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2 text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#6366f1] hover:bg-[#5558e3]"
          disabled={createDeposit.isPending}
        >
          {createDeposit.isPending ? 'Envoi...' : 'Soumettre le dépôt'}
        </Button>
      </form>
    </div>
  )
}
