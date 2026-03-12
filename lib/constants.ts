export const PLATFORM_FEE_PERCENT = 0.1

export const CATEGORIES = [
  { id: 'free-fire', label: 'Free Fire', emoji: '🔥' },
  { id: 'pubg', label: 'PUBG Mobile', emoji: '🔫' },
  { id: 'google-play', label: 'Google Play', emoji: '🎁' },
  { id: 'playstation', label: 'PlayStation', emoji: '🎮' },
] as const

export const CATEGORY_IMAGES: Record<string, string> = {
  'free-fire': '/assets/games/freefire.png',
  'pubg': '/assets/games/pubg.png',
  'google-play': '/assets/games/googleplay.png',
  'playstation': '/assets/games/playstation.png',
}
