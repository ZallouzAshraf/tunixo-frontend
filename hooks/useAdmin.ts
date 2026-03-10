'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type {
  DashboardStats,
  Order,
  SellerDeposit,
  SellerWithdrawal,
  User,
  Service,
  StockLevelItem,
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

export function useDeliverOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await api.post(`/admin/orders/${orderId}/deliver`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

export function usePendingDeposits() {
  return useQuery({
    queryKey: ['admin', 'deposits', 'pending'],
    queryFn: async () => {
      const res = await api.get('/admin/deposits/pending')
      return res.data as SellerDeposit[]
    },
  })
}

export function useAdminDeposits(status?: string) {
  return useQuery({
    queryKey: ['admin', 'deposits', status],
    queryFn: async () => {
      const url = status
        ? `/admin/deposits?status=${status}`
        : '/admin/deposits'
      const res = await api.get(url)
      return res.data as SellerDeposit[] | PaginatedResponse<SellerDeposit>
    },
  })
}

export function useConfirmDeposit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      exchangeRate,
    }: {
      id: string
      exchangeRate?: number
    }) => {
      const res = await api.patch(`/deposits/${id}/confirm`, { exchangeRate })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

export function useRejectDeposit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      rejectionReason,
    }: {
      id: string
      rejectionReason: string
    }) => {
      const res = await api.patch(`/deposits/${id}/reject`, { rejectionReason })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

export function usePendingWithdrawals() {
  return useQuery({
    queryKey: ['admin', 'withdrawals', 'pending'],
    queryFn: async () => {
      const res = await api.get('/admin/withdrawals/pending')
      return res.data as SellerWithdrawal[]
    },
  })
}

export function useAdminWithdrawals(status?: string) {
  return useQuery({
    queryKey: ['admin', 'withdrawals', status],
    queryFn: async () => {
      const url = status
        ? `/admin/withdrawals?status=${status}`
        : '/admin/withdrawals'
      const res = await api.get(url)
      return res.data as SellerWithdrawal[] | PaginatedResponse<SellerWithdrawal>
    },
  })
}

export function useCompleteWithdrawal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      note,
    }: {
      id: string
      note?: string
    }) => {
      const res = await api.patch(`/withdrawals/${id}/complete`, { note })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      rejectionReason,
    }: {
      id: string
      rejectionReason: string
    }) => {
      const res = await api.patch(`/withdrawals/${id}/reject`, {
        rejectionReason,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
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
      role: 'BUYER' | 'SELLER' | 'ADMIN'
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

// Admin Services
export function useAdminServices() {
  return useQuery({
    queryKey: ['admin', 'services'],
    queryFn: async () => {
      const res = await api.get('/services')
      return res.data as Service[]
    },
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await api.post('/services', body)
      return res.data as Service
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string
      body: Record<string, unknown>
    }) => {
      const res = await api.patch(`/services/${id}`, body)
      return res.data as Service
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}

export function useToggleService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/services/${id}/toggle`)
      return res.data as Service
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}

// Admin Stock / Accounts
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

export function useAddAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: {
      serviceId: string
      credentials: Record<string, unknown>
      accountEmail?: string
    }) => {
      const res = await api.post('/accounts', body)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stock'] })
    },
  })
}

export function useBulkAddAccounts() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: {
      serviceId: string
      accounts: Array<{ credentials: Record<string, unknown> }>
    }) => {
      const res = await api.post('/accounts/bulk', body)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stock'] })
    },
  })
}
