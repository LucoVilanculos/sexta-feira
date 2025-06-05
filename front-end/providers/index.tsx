import { AuthProvider } from "./auth-provider"
import { ThemeProvider } from "./theme-provider"
import { ToastProvider } from "./toast-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
} 