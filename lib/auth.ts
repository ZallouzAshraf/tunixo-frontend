// Auth helpers - can be extended for token refresh, logout, etc.
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

export function getStoredRole(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('user_role')
}
