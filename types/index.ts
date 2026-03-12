export interface User {
  id: string
  email: string
  fullName?: string
  phone?: string
  role: 'BUYER' | 'ADMIN'
  walletBalance: number
  isVerified: boolean
  createdAt: string
  updatedAt?: string
}

export type ServiceType = 'TOPUP' | 'GIFTCARD'
export type ProductStatus = 'ACTIVE' | 'INACTIVE'

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  category: string
  serviceType: ServiceType
  gameId?: string
  productId?: string
  priceTnd: number
  costUsd: number
  status: ProductStatus
  sortOrder: number
  createdAt: string
  updatedAt: string
  _count?: { codes: number }
}

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'

export interface Order {
  id: string
  userId: string
  user?: User
  productId: string
  product?: Product
  playerId?: string
  zoneId?: string
  playerUsername?: string
  deliveredCode?: string
  amountPaid: number
  platformFee: number
  status: OrderStatus
  apiReference?: string
  paymentReference?: string
  failureReason?: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'CREDIT' | 'DEBIT'
  reference?: string
  description?: string
  balanceAfter: number
  createdAt: string
}

export interface DashboardStats {
  totalUsers: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  failedOrders: number
  totalRevenueTnd: number
  todayOrders: number
  todayRevenue: number
  stockAlerts: Array<{ productName: string; available: number; threshold: number }>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages?: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}
