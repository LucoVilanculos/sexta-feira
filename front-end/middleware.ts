import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que não precisam de autenticação
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/api/auth/login",
  "/api/auth/register",
]

// Rotas que são sempre permitidas
const allowedRoutes = [
  "/_next",
  "/favicon.ico",
  "/images",
  "/fonts",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verifica se é uma rota permitida (assets, etc)
  if (allowedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verifica se é uma rota pública
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(process.env.COOKIE_NAME || "sexta-feira-token")
  const isAuthPage = pathname.startsWith("/auth")
  const isApiAuthRoute = pathname.startsWith("/api/auth")
  const isApiRoute = pathname.startsWith("/api")

  // Se não tiver token e não for página de autenticação ou rota de API de auth
  if (!token && !isAuthPage && !isApiAuthRoute) {
    // Se for uma rota de API, retorna 401
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    // Se for uma rota normal, redireciona para login
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Se tiver token e tentar acessar página de autenticação
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Adiciona headers de segurança
  const headers = new Headers()
  headers.set("X-Frame-Options", "DENY")
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )

  const response = NextResponse.next()
  
  // Copia os headers de segurança para a resposta
  headers.forEach((value, key) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
} 