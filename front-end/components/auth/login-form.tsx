"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/services/auth"

// Schema de validação
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const response = await authApi.login(data)

      // Armazenar o token no localStorage
      localStorage.setItem("auth_token", response.token)

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta! Redirecionando..."
      })

      // Redirecionar após login bem-sucedido
      router.push("/dashboard")
    } catch (error) {
      let errorMessage = "Credenciais inválidas ou servidor indisponível."

      if (error instanceof Error) {
        switch (error.message) {
          case "Email não encontrado":
          case "Senha incorreta":
          case "Email já está em uso":
            errorMessage = error.message
            break
          default:
            errorMessage = error.message
        }
      }

      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Campo email */}
      <div className="space-y-2 text-cyan-600">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register("email")}
          className="border-purple-500/20 bg-black/40 text-white"
        />
      </div>

      {/* Campo senha */}
      <div className="space-y-2 text-cyan-600">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="border-purple-500/20 bg-black/40 text-white pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Botão de login */}
      <Button
        type="submit"
        className="w-full text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>

      {/* Link para registro */}
      <div className="text-center text-sm">
        <span className="text-gray-400">Não tem uma conta? </span>
        <Link href="/auth/register" className="text-purple-400 hover:text-purple-300">
          Registre-se
        </Link>
      </div>
    </form>
  )
}