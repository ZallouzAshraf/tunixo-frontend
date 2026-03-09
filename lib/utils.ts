import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTND(amount: number): string {
  return `${amount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} TND`
}

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy 'à' HH:mm")
}

export function getStatusColor(status: string): string {
  const upper = status.toUpperCase()
  if (['ACTIVE', 'CONFIRMED', 'COMPLETED'].includes(upper)) {
    return 'bg-green-500/10 text-green-500 border-green-500/20'
  }
  if (upper === 'PENDING') {
    return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
  }
  if (['FAILED', 'REJECTED'].includes(upper)) {
    return 'bg-red-500/10 text-red-500 border-red-500/20'
  }
  if (['EXPIRED', 'REFUNDED'].includes(upper)) {
    return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }
  return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}
