import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/register'],
        disallow: [
          '/dashboard',
          '/admin',
          '/seller',
          '/orders',
          '/wallet',
          '/settings',
          '/api',
        ],
      },
    ],
    sitemap: 'https://tunixo.tn/sitemap.xml',
  }
}
