export interface User {
  id: string
  email: string
  fullName?: string
  phone?: string
  role: 'BUYER' | 'SELLER' | 'ADMIN'
  walletBalance: number
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  slug: string
  description?: string
  priceTnd: number
  priceUsd: number
  category?: string
  imageUrl?: string
  isActive: boolean
  stockCount?: number
  createdAt: string
}

export interface Account {
  id: string
  serviceId: string
  credentials: Record<string, unknown>
  status: 'AVAILABLE' | 'RESERVED' | 'USED'
  expiresAt?: string
  createdAt: string
}

export interface Order {
  id: string
  userId: string
  serviceId: string
  service?: Service
  accountId?: string
  account?: Account
  amountPaid: number
  platformFee: number
  status: 'PENDING' | 'ACTIVE' | 'FAILED' | 'EXPIRED' | 'REFUNDED'
  paymentReference?: string
  expiresAt?: string
  renewalReminder: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'CREDIT' | 'DEBIT' | 'WITHDRAWAL' | 'COMMISSION'
  reference?: string
  description?: string
  balanceAfter: number
  createdAt: string
}

export interface SellerDeposit {
  id: string
  sellerId: string
  amountUsd: number
  amountTnd: number
  exchangeRate: number
  sellerCommission: number
  proofUrl?: string
  paymentMethod?: string
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'USED'
  confirmedBy?: string
  confirmedAt?: string
  rejectionReason?: string
  createdAt: string
}

export interface SellerWithdrawal {
  id: string
  sellerId: string
  amountTnd: number
  method: string
  methodDetails: Record<string, unknown>
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'
  processedBy?: string
  processedAt?: string
  rejectionReason?: string
  createdAt: string
}

export interface DashboardStats {
  users: {
    total: number
    buyers: number
    sellers: number
    newToday: number
    newThisMonth: number
  }
  orders: {
    total: number
    active: number
    pending: number
    failed: number
    totalRevenue: number
    revenueToday: number
    revenueThisMonth: number
  }
  deposits: {
    total: number
    pending: number
    confirmed: number
    totalUsd: number
    totalTnd: number
  }
  withdrawals: {
    total: number
    pending: number
    completed: number
    totalTnd: number
  }
  wallet: {
    totalBuyerBalance: number
    totalSellerBalance: number
  }
  reserve: {
    currentUsd: number
  }
  services: {
    total: number
    active: number
    totalStock: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
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
