import axios, { type InternalAxiosRequestConfig } from 'axios'
import * as auth from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = auth.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (err: unknown) => void
}> = []

function onAccessTokenFetched(newAccessToken: string) {
  failedQueue.forEach((q) => q.resolve(newAccessToken))
  failedQueue = []
}

function onAccessTokenFailed(err: unknown) {
  failedQueue.forEach((q) => q.reject(err))
  failedQueue = []
}

api.interceptors.response.use(
  (response) => {
    if (response.data?.data !== undefined) {
      response.data = response.data.data
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        auth.clearTokens()
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    const refreshToken = typeof window !== 'undefined' ? auth.getRefreshToken() : null
    if (!refreshToken) {
      if (typeof window !== 'undefined') {
        auth.clearTokens()
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    if (isRefreshing) {
      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    isRefreshing = true
    originalRequest._retry = true

    try {
      const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/refresh`,
        { refreshToken }
      )
      const { accessToken, refreshToken: newRefreshToken } = data
      auth.saveTokens(accessToken, newRefreshToken)
      useAuthStore.getState().setAccessToken(accessToken)
      onAccessTokenFetched(accessToken)
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshErr) {
      onAccessTokenFailed(refreshErr)
      if (typeof window !== 'undefined') {
        auth.clearTokens()
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
