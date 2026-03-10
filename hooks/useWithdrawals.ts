'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { SellerWithdrawal } from '@/types'

export function useWithdrawals() {
  return useQuery({
    queryKey: ['withdrawals'],
    queryFn: async () => {
      const res = await api.get('/withdrawals')
      return res.data as SellerWithdrawal[]
    },
  })
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      amountTnd: number
      method: string
      methodDetails: Record<string, string>
      notes?: string
    }) => {
      const res = await api.post('/withdrawals', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    },
  })
}
