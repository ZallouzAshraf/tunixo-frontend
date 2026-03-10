'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  useAdminUsers,
  useUpdateUserRole,
  useBanUser,
} from '@/hooks/useAdmin'
import { formatTND, formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { User } from '@/types'
import { MoreHorizontal } from 'lucide-react'

const ROLE_FILTERS = [
  { id: '', label: 'Tous' },
  { id: 'BUYER', label: 'Buyers' },
  { id: 'SELLER', label: 'Sellers' },
  { id: 'ADMIN', label: 'Admins' },
] as const

function RoleBadge({ role }: { role: string }) {
  const upper = role.toUpperCase()
  const classes =
    upper === 'ADMIN'
      ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : upper === 'SELLER'
        ? 'bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]/30'
        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  const label =
    upper === 'ADMIN'
      ? 'Admin'
      : upper === 'SELLER'
        ? 'Vendeur'
        : 'Acheteur'
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  )
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [roleModalUser, setRoleModalUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<'BUYER' | 'SELLER' | 'ADMIN'>('BUYER')

  const { data, isLoading } = useAdminUsers({
    page,
    limit: 20,
    search: search.trim() || undefined,
    role: roleFilter || undefined,
  })
  const updateRole = useUpdateUserRole()
  const banUser = useBanUser()

  const paginated = data && !Array.isArray(data) ? data : null
  const users: User[] = paginated?.data ?? (Array.isArray(data) ? data : [])
  const total = paginated?.total ?? users.length
  const totalPages = Math.max(1, Math.ceil(total / 20))

  const handleRoleSubmit = () => {
    if (!roleModalUser) return
    updateRole.mutate(
      { id: roleModalUser.id, role: selectedRole },
      {
        onSuccess: () => {
          toast.success('Rôle mis à jour')
          setRoleModalUser(null)
        },
        onError: () => toast.error('Erreur'),
      }
    )
  }

  const handleBan = (user: User) => {
    banUser.mutate(user.id, {
      onSuccess: () => {
        toast.success(user.isVerified ? 'Utilisateur banni' : 'Utilisateur débanni')
      },
      onError: () => toast.error('Erreur'),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
        <p className="mt-1 text-gray-400">
          Total: {total} • Acheteurs • Vendeurs • Admins
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Rechercher (email, nom...)"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="h-10 rounded-lg border border-[#1e1e1e] bg-[#111111] px-4 text-white placeholder:text-gray-500 focus:border-[#6366f1] focus:outline-none sm:w-64"
        />
        <div className="flex gap-2">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => { setRoleFilter(f.id); setPage(1) }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                roleFilter === f.id
                  ? 'bg-[#6366f1] text-white'
                  : 'border border-[#1e1e1e] bg-[#111111] text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111]">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-left text-sm text-gray-500">
                  <th className="px-4 py-3">Avatar</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Rôle</th>
                  <th className="px-4 py-3">Solde</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#1e1e1e] last:border-0">
                    <td className="px-4 py-3">
                      <Avatar className="h-9 w-9 border border-[#1e1e1e]">
                        <AvatarFallback className="bg-[#1e1e1e] text-sm text-gray-400">
                          {(u.fullName ?? u.email ?? 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {u.fullName ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3 text-white">
                      {formatTND(u.walletBalance ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      {u.isVerified ? (
                        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                          Actif
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                          Banni
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="rounded p-1 text-gray-400 hover:bg-white/5 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 border-[#1e1e1e] bg-[#111111]"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => router.push(`/admin/users/${u.id}`)}
                          >
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => {
                              setRoleModalUser(u)
                              setSelectedRole(u.role)
                            }}
                          >
                            Changer rôle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-400"
                            onSelect={() => handleBan(u)}
                          >
                            {u.isVerified ? 'Bannir' : 'Débannir'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && users.length === 0 && (
          <p className="p-8 text-center text-gray-400">Aucun utilisateur</p>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#1e1e1e] px-4 py-3">
            <p className="text-sm text-gray-500">
              Page {page} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-1.5 text-sm text-white disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-1.5 text-sm text-white disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {roleModalUser && (
        <Dialog open={!!roleModalUser} onOpenChange={(open) => !open && setRoleModalUser(null)}>
          <DialogContent className="sm:max-w-md" showCloseButton>
            <DialogHeader>
              <DialogTitle>Changer le rôle</DialogTitle>
              <DialogDescription>
                Utilisateur: {roleModalUser.email}. Sélectionnez le nouveau rôle.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'BUYER' | 'SELLER' | 'ADMIN')}
                className="w-full rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2 text-white focus:border-[#6366f1] focus:outline-none"
              >
                <option value="BUYER">Acheteur</option>
                <option value="SELLER">Vendeur</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <DialogFooter showCloseButton={false} className="gap-2">
              <Button variant="outline" onClick={() => setRoleModalUser(null)} disabled={updateRole.isPending}>
                Annuler
              </Button>
              <Button
                onClick={handleRoleSubmit}
                disabled={updateRole.isPending || selectedRole === roleModalUser.role}
              >
                {updateRole.isPending ? 'Chargement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
