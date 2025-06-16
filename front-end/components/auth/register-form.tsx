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
const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      // Armazenar o token no localStorage
      localStorage.setItem("auth_token", response.token)

      toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para o dashboard...",
      })

      // Redirecionar após registro bem-sucedido
      router.push("/dashboard")
    } catch (error) {
      let errorMessage = "Ocorreu um erro ao criar sua conta."

      if (error instanceof Error) {
        switch (error.message) {
          case "Email já está em uso":
            errorMessage = "Esse email já está sendo usado. Tente outro."
            break
          case "Senha muito curta":
            errorMessage = "Sua senha deve ter pelo menos 6 caracteres."
            break
          default:
            errorMessage = error.message
        }
      }

      toast({
        title: "Erro no registro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Campo nome */}
      <div className="space-y-2 text-cyan-600">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          {...register("name")}
          className="border-purple-500/20 bg-black/40 text-white"
        />
        {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
      </div>

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
        {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
      </div>

      {/* Campo senha */}
      <div className="space-y-2 text-cyan-600">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="confirme a palavra-passe"
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
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Confirmar senha */}
      <div className="space-y-2 text-cyan-600">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="border-purple-500/20 bg-black/40 text-white pr-10"
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Botão de envio */}
      <Button
        type="submit"
        className="w-full text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          "Criar conta"
        )}
      </Button>

      {/* Link para login */}
      <div className="text-center text-sm">
        <span className="text-gray-400">Já tem uma conta? </span>
        <Link href="/auth/login" className="text-purple-400 hover:text-purple-300">
          Faça login
        </Link>
      </div>
    </form>
  )
}