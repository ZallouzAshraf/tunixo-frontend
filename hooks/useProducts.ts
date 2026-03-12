import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Product } from '@/types'

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      const url = category
        ? `/products/category/${encodeURIComponent(category)}`
        : '/products'
      const res = await api.get<Product[]>(url)
      return res.data
    },
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get<Product>(`/products/${encodeURIComponent(slug)}`)
      return res.data
    },
    enabled: !!slug,
  })
}
