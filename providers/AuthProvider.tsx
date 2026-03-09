'use client'

import { useEffect } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { User } from '@/types'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, setLoading } = useAuthStore()

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? (JSON.parse(localStorage.getItem('tunixo-auth') || '{}')?.state?.accessToken ?? null)
        : null

    if (!token) {
      setLoading(false)
      return
    }

    api
      .get<User>('/users/me')
      .then((res) => {
        const user = res.data as User
        setAuth(user, token)
      })
      .catch(() => {
        clearAuth()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [setAuth, clearAuth, setLoading])

  return <>{children}</>
}
