import { AuthProvider } from "@/providers/auth-provider"
import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="w-full max-w-md p-6">
        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Sexta-feira
            </CardTitle>
            <CardDescription className="font-bold bg-gradient-to-r from-cyan-800 to-slate-400 bg-clip-text text-transparent">Crie sua conta para começar a usar sua assistente pessoal</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthProvider>
              <RegisterForm />
            </AuthProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
