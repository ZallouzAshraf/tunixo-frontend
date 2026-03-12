'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { useWalletBalance } from '@/hooks/useWallet'
import { formatTND, formatDate } from '@/lib/utils'
import { fadeIn, staggerContainer, staggerItem } from '@/lib/animations'
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton'
import EmptyState from '@/components/common/EmptyState'
import StatusBadge from '@/components/common/StatusBadge'

export default function DashboardPage() {
  const { user } = useCurrentUser()
  const { data: walletData, isLoading: walletLoading } = useWalletBalance()
  const { data: orders = [], isLoading: ordersLoading } = useOrders()

  const balance = walletData?.balance ?? 0
  const totalOrders = orders.length
  const activeCount = orders.filter((o) => o.status === 'COMPLETED').length
  const pendingCount = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'PROCESSING',
  ).length
  const recentOrders = orders.slice(0, 5)

  const isLoading = walletLoading || ordersLoading
  const fullName = user?.fullName ?? user?.email ?? 'Utilisateur'

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <motion.div
      className="space-y-8"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <div>
        <h2 className="text-2xl font-bold text-white">
          Bonjour, {fullName} 👋
        </h2>
        <p className="mt-1 text-gray-400">
          Voici un aperçu de votre compte
        </p>
      </div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={staggerItem} className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6 transition-all duration-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <p className="text-sm text-gray-500">Solde wallet</p>
              <p className="text-2xl font-bold text-[#6366f1]">
                {formatTND(balance)}
              </p>
              <p className="text-xs text-gray-500">Disponible</p>
            </div>
          </div>
          <Link
            href="/wallet"
            className="mt-4 inline-block text-sm font-medium text-[#6366f1] hover:underline"
          >
            Recharger
          </Link>
        </motion.div>

        <motion.div variants={staggerItem} className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6 transition-all duration-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="text-sm text-gray-500">Commandes totales</p>
              <p className="text-2xl font-bold text-white">{totalOrders}</p>
              <p className="text-xs text-gray-500">{activeCount} complétées</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6 transition-all duration-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-sm text-gray-500">Top-ups complétés</p>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
              <p className="text-xs text-gray-500">Livrés</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-6 transition-all duration-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="text-sm text-gray-500">En cours</p>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
              <p className="text-xs text-gray-500">En traitement</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {balance === 0 && (
        <div className="rounded-xl bg-gradient-to-r from-[#6366f1]/30 to-[#8b5cf6]/30 border border-[#6366f1]/30 p-6">
          <p className="text-lg font-semibold text-white">
            Votre wallet est vide
          </p>
          <p className="mt-1 text-gray-300">
            Rechargez pour top-up vos jeux préférés
          </p>
          <Link
            href="/wallet"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5558e3]"
          >
            Recharger maintenant
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Actions rapides
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/products"
            className="group flex items-center gap-4 rounded-xl border border-[#1e1e1e] bg-[#111111] p-5 transition-all duration-200 hover:border-[#6366f1]/50"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#6366f1]/20 text-2xl">
              🎮
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white group-hover:text-[#6366f1]">
                Top-up jeux
              </p>
              <p className="text-sm text-gray-500">
                Free Fire, PUBG et plus
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-gray-500 group-hover:text-[#6366f1]" />
          </Link>

          <Link
            href="/products?category=gift-cards"
            className="group flex items-center gap-4 rounded-xl border border-[#1e1e1e] bg-[#111111] p-5 transition-all duration-200 hover:border-[#6366f1]/50"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#6366f1]/20 text-2xl">
              🎁
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white group-hover:text-[#6366f1]">
                Cartes cadeaux
              </p>
              <p className="text-sm text-gray-500">
                Google Play, PlayStation
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-gray-500 group-hover:text-[#6366f1]" />
          </Link>

          <Link
            href="/orders"
            className="group flex items-center gap-4 rounded-xl border border-[#1e1e1e] bg-[#111111] p-5 transition-all duration-200 hover:border-[#6366f1]/50"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#6366f1]/20 text-2xl">
              📦
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white group-hover:text-[#6366f1]">
                Mes commandes
              </p>
              <p className="text-sm text-gray-500">
                Historique de vos achats
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-gray-500 group-hover:text-[#6366f1]" />
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Commandes récentes
          </h3>
          <Link
            href="/orders"
            className="text-sm font-medium text-[#6366f1] hover:underline"
          >
            Voir tout →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="Aucune commande pour le moment"
            description="Découvrez nos offres et top-up vos jeux préférés."
            action={{ label: 'Découvrir les produits', href: '/products' }}
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#1e1e1e] bg-[#111111]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1e1e1e]">
                    <th className="px-4 py-3 font-medium text-gray-400">
                      Produit
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-400">
                      Détails
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-400">
                      Montant
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-400">
                      Statut
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-400">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#1e1e1e] last:border-0"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-white">
                          {order.product?.name ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {order.playerId ?? order.deliveredCode ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {formatTND(order.amountPaid)} TND
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
