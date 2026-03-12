import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Order } from '@/types'

export interface CreateOrderInput {
  productId: string
  playerId?: string
  zoneId?: string
}

export interface CreateOrderResponse {
  order: Order
  autoDelivered: boolean
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await api.get('/orders')
      return res.data as Order[]
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`)
      return res.data as Order
    },
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      const res = await api.post<CreateOrderResponse>('/orders', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    },
  })
}
