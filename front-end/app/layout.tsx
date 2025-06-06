import './globals.css'
import type { Metadata } from 'next'

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
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
