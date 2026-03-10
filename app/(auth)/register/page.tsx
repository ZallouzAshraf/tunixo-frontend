import type { Metadata } from 'next'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Créer un compte',
  robots: { index: false },
}

export default function RegisterPage() {
  return <RegisterForm />
}
