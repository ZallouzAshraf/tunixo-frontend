'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type {
  DashboardStats,
  Order,
  User,
  Product,
  PaginatedResponse,
} from '@/types'

export function useDashboardStats(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard')
      return res.data as DashboardStats
    },
    refetchInterval: 30000,
    enabled,
  })
}

export function useAdminOrders(params?: {
  status?: string
  page?: number
  limit?: number
  search?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.set('status', params.status)
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.limit) searchParams.set('limit', String(params.limit ?? 20))
  if (params?.search) searchParams.set('search', params.search)
  const query = searchParams.toString()

  return useQuery({
    queryKey: ['admin', 'orders', params?.status, params?.page, params?.search],
    queryFn: async () => {
      const url = query ? `/admin/orders?${query}` : '/admin/orders'
      const res = await api.get(url)
      return res.data as PaginatedResponse<Order>
    },
  })
}

export function useRetryOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await api.post(`/admin/orders/${orderId}/retry`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useAdminUsers(params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.limit) searchParams.set('limit', String(params.limit ?? 20))
  if (params?.search) searchParams.set('search', params.search)
  if (params?.role) searchParams.set('role', params.role)
  const query = searchParams.toString()

  return useQuery({
    queryKey: ['admin', 'users', params?.page, params?.search, params?.role],
    queryFn: async () => {
      const url = query ? `/admin/users?${query}` : '/admin/users'
      const res = await api.get(url)
      return res.data as PaginatedResponse<User>
    },
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      role,
    }: {
      id: string
      role: 'BUYER' | 'ADMIN'
    }) => {
      const res = await api.patch(`/admin/users/${id}/role`, { role })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

export function useBanUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.patch(`/admin/users/${userId}/ban`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

// Admin Products
export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const res = await api.get('/products')
      return res.data as Product[]
    },
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await api.post('/products', body)
      return res.data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string
      body: Record<string, unknown>
    }) => {
      const res = await api.patch(`/products/${id}`, body)
      return res.data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/products/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Admin Gift codes
export interface GiftCodeStatsItem {
  productId: string
  productName: string
  available: number
}

export function useGiftCodesStats() {
  return useQuery({
    queryKey: ['admin', 'giftcodes', 'stats'],
    queryFn: async () => {
      const res = await api.get('/admin/giftcodes/stats')
      return res.data as GiftCodeStatsItem[]
    },
  })
}

export function useBulkCreateGiftCodes() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: { productId: string; codes: string[] }) => {
      const res = await api.post('/admin/giftcodes/bulk', body)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'giftcodes'] })
    },
  })
}
