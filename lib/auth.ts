const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_ROLE_COOKIE = 'user_role'
const ACCESS_TOKEN_COOKIE = 'access_token'
const COOKIE_MAX_AGE = 604800 // 7 days

function safeDoc(): Document | null {
  if (typeof document === 'undefined') return null
  return document
}

export function saveTokens(accessToken: string, refreshToken: string): void {
  const doc = safeDoc()
  if (!doc) return
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  doc.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(accessToken)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function clearTokens(): void {
  const doc = safeDoc()
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
  if (doc) {
    doc.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0`
    doc.cookie = `${USER_ROLE_COOKIE}=; path=/; max-age=0`
  }
}

export function saveUserRole(role: string): void {
  const doc = safeDoc()
  if (!doc) return
  doc.cookie = `${USER_ROLE_COOKIE}=${encodeURIComponent(role)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function getUserRole(): string | null {
  const doc = safeDoc()
  if (!doc) return null
  const match = doc.cookie.match(new RegExp(`(?:^|; )${USER_ROLE_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function isAuthenticated(): boolean {
  return !!getAccessToken()
}
