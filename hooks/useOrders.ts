import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Order } from '@/types'

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
