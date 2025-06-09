import './globals.css'

import type { Metadata } from 'next'

import { AuthProvider } from '@/providers/auth-provider'

export const metadata: Metadata = {
  title: 'Sexta-Feira',
  description: 'Seu assistente pessoal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-Pt">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
