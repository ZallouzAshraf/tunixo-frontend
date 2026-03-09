'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import * as auth from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types'

type AuthResponse = { user: User; accessToken: string; refreshToken: string }

function applyAuthSuccess(data: AuthResponse) {
  auth.saveTokens(data.accessToken, data.refreshToken)
  auth.saveUserRole(data.user.role)
  useAuthStore.getState().setAuth(data.user, data.accessToken)
}

function getRedirectForRole(role: string): string {
  if (role === 'ADMIN') return '/admin'
  if (role === 'SELLER') return '/seller'
  return '/dashboard'
}

export function useLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const { data } = await api.post<AuthResponse>('/auth/login', {
          email,
          password,
        })
        const payload = data as unknown as AuthResponse
        applyAuthSuccess(payload)
        router.push(getRedirectForRole(payload.user.role))
      } catch (err: unknown) {
        const status = err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number; data?: { message?: string } } }).response?.status
          : null
        const message = err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
        if (status === 401) {
          setError('Email ou mot de passe incorrect')
        } else {
          setError(message && typeof message === 'string' ? message : 'Une erreur est survenue')
        }
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  return { login, isLoading, error }
}

export function useRegister() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = useCallback(
    async (payload: { email: string; password: string; fullName: string; role: 'BUYER' | 'SELLER' }) => {
      setIsLoading(true)
      setError(null)
      try {
        const { data } = await api.post<AuthResponse>('/auth/register', payload)
        const res = data as unknown as AuthResponse
        applyAuthSuccess(res)
        const redirect = res.user.role === 'SELLER' ? '/seller' : '/dashboard'
        router.push(redirect)
      } catch (err: unknown) {
        const status = err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : null
        const message = err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
        if (status === 409) {
          setError('Cet email est déjà utilisé')
        } else {
          setError(message && typeof message === 'string' ? message : 'Une erreur est survenue')
        }
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  return { register, isLoading, error }
}

export function useLogout() {
  const router = useRouter()

  const logout = useCallback(() => {
    const token = auth.getAccessToken()
    auth.clearTokens()
    useAuthStore.getState().clearAuth()
    if (token) {
      api.post('/auth/logout').catch(() => {})
    }
    router.push('/login')
  }, [router])

  return { logout }
}

export function useCurrentUser() {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return { user, isLoading, isAuthenticated }
}
