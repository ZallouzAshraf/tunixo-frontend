'use client'

import AppLayout from '@/components/layout/AppLayout'

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
