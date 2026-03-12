'use client'

import type { Transaction } from '@/types'
import { formatTND, formatDateTime } from '@/lib/utils'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20

type FilterType = 'all' | 'credit' | 'debit'

function filterTransactions(
  transactions: Transaction[],
  filter: FilterType
): Transaction[] {
  if (filter === 'all') return transactions
  if (filter === 'credit') return transactions.filter((t) => t.type === 'CREDIT')
  return transactions.filter((t) => t.type === 'DEBIT')
}

function TransactionRow({ t }: { t: Transaction }) {
  const isCredit = t.type === 'CREDIT'
  const isDebit = t.type === 'DEBIT'
  const Icon = isCredit ? ArrowDownCircle : ArrowUpCircle

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#1e1e1e] py-4 last:border-0">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            isCredit && 'bg-green-500/10 text-green-500',
            isDebit && 'bg-red-500/10 text-red-500'
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-medium text-white">
            {t.description ?? t.type}
          </p>
          <p className="text-xs text-gray-500">{formatDateTime(t.createdAt)}</p>
          {t.reference && (
            <p className="truncate text-xs text-gray-600" title={t.reference}>
              {t.reference}
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={cn(
            'font-medium',
            isCredit && 'text-green-500',
            isDebit && 'text-red-500'
          )}
        >
          {isCredit ? '+' : '-'}
          {formatTND(Math.abs(t.amount))}
        </p>
        <p className="text-xs text-gray-500">
          Solde : {formatTND(t.balanceAfter)}
        </p>
      </div>
    </div>
  )
}

interface TransactionListProps {
  transactions: Transaction[]
  filter: FilterType
}

export default function TransactionList({ transactions, filter }: TransactionListProps) {
  const [showCount, setShowCount] = useState(PAGE_SIZE)
  const filtered = filterTransactions(transactions, filter)
  const visible = filtered.slice(0, showCount)
  const hasMore = filtered.length > showCount

  return (
    <div className="divide-y-0">
      {visible.map((t) => (
        <TransactionRow key={t.id} t={t} />
      ))}
      {hasMore && (
        <div className="pt-4">
          <button
            type="button"
            onClick={() => setShowCount((n) => n + PAGE_SIZE)}
            className="text-sm font-medium text-[#6366f1] hover:underline"
          >
            Voir plus
          </button>
        </div>
      )}
    </div>
  )
}
