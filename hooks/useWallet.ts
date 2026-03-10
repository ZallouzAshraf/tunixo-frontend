import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Transaction } from '@/types'

export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: async () => {
      const res = await api.get('/wallet/balance')
      return res.data as { balance: number }
    },
  })
}

export function useTransactions() {
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: async () => {
      const res = await api.get('/wallet/transactions')
      return (Array.isArray(res.data) ? res.data : []) as Transaction[]
    },
  })
}

export type TopupResponse = { paymentRef?: string; payUrl: string; amount: number }

export function useTopup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: { amount: number; description?: string }) => {
      const res = await api.post<TopupResponse>('/payments/topup', body)
      return res.data as TopupResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    },
  })
}
