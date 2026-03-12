import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'

export interface ValidatePlayerInput {
  gameId: string
  playerId: string
  zoneId?: string
}

export interface ValidatePlayerResult {
  valid: boolean
  username: string
}

export function useValidatePlayer() {
  return useMutation({
    mutationFn: async (data: ValidatePlayerInput) => {
      const res = await api.post<ValidatePlayerResult>(
        '/topup/validate-player',
        data,
      )
      return res.data
    },
  })
}
