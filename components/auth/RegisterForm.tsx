'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useRegister } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Min 2 caractères'),
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Min 6 caractères'),
    confirmPassword: z.string(),
    role: z.enum(['BUYER', 'SELLER']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const ROLE_OPTIONS: { value: 'BUYER' | 'SELLER'; icon: string; title: string; description: string }[] = [
  { value: 'BUYER', icon: '🛒', title: 'Je veux des abonnements', description: 'Accède aux services digitaux en payant en TND' },
  { value: 'SELLER', icon: '💰', title: 'Je suis freelance', description: 'Utilise tes revenus digitaux et reçois des TND' },
]

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: doRegister, isLoading, error } = useRegister()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'BUYER' },
  })

  const selectedRole = watch('role')

  const onSubmit = (data: RegisterFormData) => {
    doRegister({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: data.role,
    })
  }

  return (
    <div className="rounded-xl border border-[#222222] bg-[#111111] p-6 sm:p-8 transition-all duration-200">
      <h1 className="text-2xl font-bold text-white">Créer un compte</h1>
      <p className="mt-1 text-gray-400 text-sm">Rejoins la communauté Tunixo</p>

      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-gray-300">Tu es...</p>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue('role', opt.value)}
              className={cn(
                'rounded-lg border-2 p-4 text-left transition-all duration-200',
                selectedRole === opt.value
                  ? 'border-[#6366f1] bg-[#6366f1]/10'
                  : 'border-[#222222] bg-[#0a0a0a] hover:border-[#333]'
              )}
            >
              <span className="text-2xl">{opt.icon}</span>
              <p className="mt-2 text-sm font-semibold text-white">{opt.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{opt.description}</p>
            </button>
          ))}
        </div>
        <input type="hidden" {...register('role')} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Nom complet</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            disabled={isLoading}
            className={cn(
              'mt-1.5 w-full rounded-lg border border-[#222222] bg-[#0a0a0a] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20',
              errors.fullName && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            )}
            placeholder="Ahmed Ben Ali"
            {...register('fullName')}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            className={cn(
              'mt-1.5 w-full rounded-lg border border-[#222222] bg-[#0a0a0a] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20',
              errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            )}
            placeholder="tu@email.com"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Mot de passe</label>
          <div className="relative mt-1.5">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              disabled={isLoading}
              className={cn(
                'w-full rounded-lg border border-[#222222] bg-[#0a0a0a] px-4 py-2.5 pr-10 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20',
                errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
              placeholder="••••••••"
              {...register('password')}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirmer le mot de passe</label>
          <div className="relative mt-1.5">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              disabled={isLoading}
              className={cn(
                'w-full rounded-lg border border-[#222222] bg-[#0a0a0a] px-4 py-2.5 pr-10 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20',
                errors.confirmPassword && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
              placeholder="••••••••"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#6366f1] py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#5558e3] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Création...
            </>
          ) : (
            'Créer mon compte'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-[#6366f1] hover:underline font-medium">
          Se connecter →
        </Link>
      </p>
    </div>
  )
}
