import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import api from '@/lib/api'
import type { Service } from '@/types'

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await api.get('/services')
      return res.data as Service[]
    },
  })
}

export function useService(slug: string) {
  return useQuery({
    queryKey: ['services', slug],
    queryFn: async () => {
      const res = await api.get(`/services/${slug}`)
      return res.data as Service
    },
    enabled: !!slug,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { serviceId: string; serviceEmail: string }) => {
      const res = await api.post('/orders', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    },
  })
}
