'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { SellerDeposit } from '@/types'

export function useDeposits() {
  return useQuery({
    queryKey: ['deposits'],
    queryFn: async () => {
      const res = await api.get('/deposits/my')
      return res.data as SellerDeposit[]
    },
  })
}

export function useCreateDeposit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      amountUsd: number
      paymentMethod: string
      proofUrl: string
      notes?: string
    }) => {
      const res = await api.post('/deposits', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    },
  })
}
