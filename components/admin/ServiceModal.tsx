'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { slugFromName } from '@/lib/utils'
import type { Service } from '@/types'

const CATEGORIES = [
  'AI Tools',
  'Design',
  'Productivity',
  'Entertainment',
  'Development',
  'Other',
] as const

const serviceSchema = z.object({
  name: z.string().min(2, 'Min 2 caractères'),
  description: z.string().optional(),
  priceTnd: z.number().min(1, 'Min 1 TND'),
  priceUsd: z.number().min(1, 'Min 1 USD'),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
  deliveryType: z.enum(['ACCOUNT', 'MANUAL']),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  service?: Service | null
  onSubmit: (data: ServiceFormData) => void
  isLoading?: boolean
}

export default function ServiceModal({
  isOpen,
  onClose,
  mode,
  service,
  onSubmit,
  isLoading = false,
}: ServiceModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      priceTnd: 1,
      priceUsd: 1,
      category: '',
      imageUrl: '',
      deliveryType: 'ACCOUNT',
    },
  })

  const name = watch('name')
  const slugPreview = name ? slugFromName(name) : '—'

  useEffect(() => {
    if (isOpen && service && mode === 'edit') {
      reset({
        name: service.name,
        description: service.description ?? '',
        priceTnd: service.priceTnd,
        priceUsd: service.priceUsd,
        category: service.category ?? '',
        imageUrl: service.imageUrl ?? '',
        deliveryType: (service.deliveryType as 'ACCOUNT' | 'MANUAL') ?? 'ACCOUNT',
      })
    }
    if (isOpen && mode === 'create') {
      reset({
        name: '',
        description: '',
        priceTnd: 1,
        priceUsd: 1,
        category: '',
        imageUrl: '',
        deliveryType: 'ACCOUNT',
      })
    }
  }, [isOpen, mode, service, reset])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nouveau service' : `Modifier ${service?.name ?? ''}`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Remplissez les champs pour créer un nouveau service.'
              : 'Modifiez les champs puis sauvegardez.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du service</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Cursor Pro"
              className="bg-[#111111] border-[#1e1e1e] text-white"
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              placeholder="Description du service..."
              className="w-full rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2 text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceTnd">Prix TND</Label>
              <Input
                id="priceTnd"
                type="number"
                step="0.001"
                {...register('priceTnd', { valueAsNumber: true })}
                className="bg-[#111111] border-[#1e1e1e] text-white"
              />
              {errors.priceTnd && (
                <p className="text-sm text-red-400">{errors.priceTnd.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceUsd">Prix USD</Label>
              <Input
                id="priceUsd"
                type="number"
                step="0.01"
                {...register('priceUsd', { valueAsNumber: true })}
                className="bg-[#111111] border-[#1e1e1e] text-white"
              />
              {errors.priceUsd && (
                <p className="text-sm text-red-400">{errors.priceUsd.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select
              value={watch('category') || 'Other'}
              onValueChange={(v) => setValue('category', v ?? '')}
            >
              <SelectTrigger className="w-full border-[#1e1e1e] bg-[#111111] text-white">
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent className="border-[#1e1e1e] bg-[#111111]">
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="text-white">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optionnel)</Label>
            <Input
              id="imageUrl"
              {...register('imageUrl')}
              placeholder="https://..."
              className="bg-[#111111] border-[#1e1e1e] text-white"
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-400">{errors.imageUrl.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Type de livraison</Label>
            <Select
              value={watch('deliveryType')}
              onValueChange={(v) => setValue('deliveryType', (v as 'ACCOUNT' | 'MANUAL') ?? 'ACCOUNT')}
            >
              <SelectTrigger className="w-full border-[#1e1e1e] bg-[#111111] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-[#1e1e1e] bg-[#111111]">
                <SelectItem value="ACCOUNT" className="text-white">
                  Livraison automatique (stock)
                </SelectItem>
                <SelectItem value="MANUAL" className="text-white">
                  Livraison manuelle (admin)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-lg bg-[#1e1e1e] px-3 py-2 text-sm text-gray-400">
            Slug généré: <span className="font-mono text-white">{slugPreview}</span>
          </div>
          <DialogFooter showCloseButton={false} className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Chargement...'
                : mode === 'create'
                  ? 'Créer le service'
                  : 'Sauvegarder les modifications'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
