'use client'

import Link from 'next/link'
import { formatTND } from '@/lib/utils'

interface WalletBalanceProps {
  balance: number
  onTopup: () => void
}

export default function WalletBalance({ balance, onTopup }: WalletBalanceProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-full bg-[#6366f1]/20 px-3 py-1.5 text-sm font-medium text-[#6366f1]">
        {formatTND(balance)}
      </span>
      <button
        type="button"
        onClick={onTopup}
        className="text-sm font-medium text-[#6366f1] hover:underline"
      >
        Recharger
      </button>
      <Link
        href="/wallet"
        className="text-sm text-gray-400 hover:text-white"
      >
        Wallet
      </Link>
    </div>
  )
}
