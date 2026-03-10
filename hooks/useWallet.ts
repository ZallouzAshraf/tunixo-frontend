import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

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
      return res.data
    },
  })
}
