'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Account, StockLevelItem } from '@/types'

export function useStockLevels() {
  return useQuery({
    queryKey: ['admin', 'stock'],
    queryFn: async () => {
      const res = await api.get('/accounts/stock')
      return res.data as StockLevelItem[]
    },
    refetchInterval: 60000,
  })
}

export function useAllAccounts() {
  return useQuery({
    queryKey: ['admin', 'accounts'],
    queryFn: async () => {
      const res = await api.get('/accounts')
      return res.data as Account[]
    },
  })
}

export function useAddAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      serviceId: string
      accountEmail?: string
      credentials: Record<string, string>
    }) => {
      const res = await api.post('/accounts', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stock'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] })
    },
  })
}

export function useBulkAddAccounts() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      serviceId: string
      accounts: Array<Record<string, string>>
    }) => {
      const body = {
        serviceId: data.serviceId,
        accounts: data.accounts.map((cred) => ({ credentials: cred })),
      }
      const res = await api.post('/accounts/bulk', body)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stock'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (accountId: string) => {
      const res = await api.delete(`/accounts/${accountId}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stock'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] })
    },
  })
}
