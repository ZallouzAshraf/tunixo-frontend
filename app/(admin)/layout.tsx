'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCurrentUser } from '@/hooks/useAuth'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminNavbar from '@/components/layout/AdminNavbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user || user.role !== 'ADMIN') {
      router.replace('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6366f1] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <AdminNavbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
