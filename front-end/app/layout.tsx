import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sexta-Feira - Seu Assistente Virtual",
  description: "Assistente virtual inteligente para ajudar no seu dia a dia",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
