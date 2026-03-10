'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewAdminServicePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/services')
  }, [router])
  return null
}
