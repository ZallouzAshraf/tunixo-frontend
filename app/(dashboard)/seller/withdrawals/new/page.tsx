'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCurrentUser } from '@/hooks/useAuth'
import { useWalletBalance } from '@/hooks/useWallet'
import { useCreateWithdrawal } from '@/hooks/useWithdrawals'
import { formatTND } from '@/lib/utils'
import { MIN_WITHDRAWAL_TND } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewWithdrawalPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useCurrentUser()
  const { data: balanceData } = useWalletBalance()
  const [success, setSuccess] = useState<{
    amountTnd: number
    method: string
    methodDetails: string
  } | null>(null)
  const createWithdrawal = useCreateWithdrawal()

  const balance = balanceData?.balance ?? 0

  const schema = z.object({
    amountTnd: z
      .number()
      .min(MIN_WITHDRAWAL_TND, `Minimum ${MIN_WITHDRAWAL_TND} TND`)
      .max(balance, 'Solde insuffisant'),
    method: z.enum(['D17', 'VIREMENT']),
    methodDetails: z.string().min(5, 'Requis'),
    notes: z.string().optional(),
  })

  type FormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amountTnd: Math.min(balance, Math.max(MIN_WITHDRAWAL_TND, 0)),
      method: 'D17',
      methodDetails: '',
      notes: '',
    },
  })

  const amountTnd = watch('amountTnd')
  const method = watch('method')
  const methodDetails = watch('methodDetails')

  useEffect(() => {
    if (authLoading) return
    if (user && user.role !== 'SELLER') router.replace('/dashboard')
  }, [user, authLoading, router])

  const onSubmit = (data: FormData) => {
    const methodDetailsObj: Record<string, string> =
      data.method === 'D17' ? { phone: data.methodDetails } : { iban: data.methodDetails }
    createWithdrawal.mutate(
      {
        amountTnd: data.amountTnd,
        method: data.method,
        methodDetails: methodDetailsObj,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          setSuccess({
            amountTnd: data.amountTnd,
            method: data.method,
            methodDetails: data.methodDetails,
          })
        },
      }
    )
  }

  if (authLoading) return null
  if (!user || user.role !== 'SELLER') return null

  if (balance < MIN_WITHDRAWAL_TND && !success) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <nav className="text-sm text-gray-400">
          <Link href="/seller/withdrawals" className="hover:text-white">
            Mes retraits
          </Link>
          <span className="mx-2">›</span>
          <span className="text-white">Nouveau retrait</span>
        </nav>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="font-semibold text-red-200">Solde insuffisant</p>
          <p className="mt-2 text-sm text-gray-300">
            Solde disponible: {formatTND(balance)}. Minimum pour retirer: {MIN_WITHDRAWAL_TND} TND.
          </p>
          <Link
            href="/seller/deposits/new"
            className="mt-4 inline-block rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
          >
            Soumettre un dépôt d&apos;abord
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <nav className="text-sm text-gray-400">
          <Link href="/seller/withdrawals" className="hover:text-white">
            Mes retraits
          </Link>
          <span className="mx-2">›</span>
          <span className="text-white">Nouveau retrait</span>
        </nav>
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
          <p className="text-2xl">✅</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Demande de retrait soumise !
          </h2>
          <div className="mt-4 rounded-lg bg-[#111111] p-4 text-left">
            <p className="text-sm text-gray-400">
              Montant: {formatTND(success.amountTnd)}
            </p>
            <p className="text-sm text-gray-400">Méthode: {success.method}</p>
            <p className="text-sm text-gray-400">Vers: {success.methodDetails}</p>
            <p className="text-sm text-gray-400">Statut: En attente</p>
          </div>
          <p className="mt-4 text-sm text-gray-300">
            Notre équipe traitera votre retrait sous 24h. Votre solde a été réservé.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/seller/withdrawals"
              className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white hover:bg-[#5558e3]"
            >
              Voir mes retraits
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
        <Link href="/seller/withdrawals" className="hover:text-white">
          Mes retraits
        </Link>
        <span className="mx-2">›</span>
        <span className="text-white">Nouveau retrait</span>
      </nav>

      <div className="rounded-xl border border-[#6366f1]/30 bg-[#111111] p-4">
        <p className="text-xl font-semibold text-[#6366f1]">
          Solde disponible: {formatTND(balance)}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amountTnd">Montant à retirer (TND)</Label>
          <div className="flex gap-2">
            <Input
              id="amountTnd"
              type="number"
              step="0.001"
              min={MIN_WITHDRAWAL_TND}
              max={balance}
              {...register('amountTnd', { valueAsNumber: true })}
              className="bg-[#111111] border-[#1e1e1e] text-white"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setValue('amountTnd', balance)}
              className="shrink-0"
            >
              Tout retirer
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Minimum {MIN_WITHDRAWAL_TND} TND — Maximum {formatTND(balance)}
          </p>
          {errors.amountTnd && (
            <p className="text-sm text-red-400">{errors.amountTnd.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Méthode de retrait</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('method', 'D17')}
              className={`rounded-xl border p-4 text-left transition-colors ${
                method === 'D17'
                  ? 'border-[#6366f1] bg-[#6366f1]/10'
                  : 'border-[#1e1e1e] bg-[#111111] hover:border-[#6366f1]/30'
              }`}
            >
              <span className="text-2xl">📱</span>
              <p className="mt-2 font-medium text-white">D17</p>
              <p className="mt-1 text-xs text-gray-400">
                Virement instantané vers votre numéro D17
              </p>
            </button>
            <button
              type="button"
              onClick={() => setValue('method', 'VIREMENT')}
              className={`rounded-xl border p-4 text-left transition-colors ${
                method === 'VIREMENT'
                  ? 'border-[#6366f1] bg-[#6366f1]/10'
                  : 'border-[#1e1e1e] bg-[#111111] hover:border-[#6366f1]/30'
              }`}
            >
              <span className="text-2xl">🏦</span>
              <p className="mt-2 font-medium text-white">Virement bancaire</p>
              <p className="mt-1 text-xs text-gray-400">
                Virement vers votre compte (1-3 jours ouvrables)
              </p>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="methodDetails">
            {method === 'D17' ? 'Numéro D17' : 'IBAN tunisien'}
          </Label>
          <Input
            id="methodDetails"
            {...register('methodDetails')}
            placeholder={method === 'D17' ? '+21698XXXXXX' : 'TN59XXXXXXXXXXXXXX'}
            className="bg-[#111111] border-[#1e1e1e] text-white"
          />
          {errors.methodDetails && (
            <p className="text-sm text-red-400">{errors.methodDetails.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optionnel)</Label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={2}
            className="w-full rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2 text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none"
          />
        </div>

        <div className="rounded-lg border border-[#1e1e1e] bg-[#111111] p-4">
          <p className="text-sm text-gray-400">
            Retrait demandé <span className="font-semibold text-white">{formatTND(amountTnd)}</span>
          </p>
          <p className="text-sm text-gray-400">
            Méthode <span className="text-white">{method}</span>
          </p>
          <p className="text-sm text-gray-400">
            Vers <span className="text-white">{methodDetails || '—'}</span>
          </p>
          <p className="text-sm text-gray-400">
            Délai <span className="text-white">{method === 'D17' ? 'Instantané' : '1-3 jours'}</span>
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#6366f1] hover:bg-[#5558e3]"
          disabled={createWithdrawal.isPending || amountTnd > balance || amountTnd < MIN_WITHDRAWAL_TND}
        >
          {createWithdrawal.isPending ? 'Envoi...' : 'Demander le retrait'}
        </Button>
      </form>
    </div>
  )
}
