import { ReactNode } from "react"

interface ConfigSectionProps {
  children: ReactNode
}

export function ConfigSection({ children }: ConfigSectionProps) {
  return <div className="space-y-2">{children}</div>
} 