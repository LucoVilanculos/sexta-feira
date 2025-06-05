import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchApi } from "@/lib/fetch"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const user = await fetchApi<User>("/api/auth/me")
      setUser(user)
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    try {
      const user = await fetchApi<User>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      setUser(user)
      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const user = await fetchApi<User>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      })
      setUser(user)
      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    try {
      await fetchApi("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/auth/login")
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 