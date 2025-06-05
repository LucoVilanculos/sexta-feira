import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ConfigInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function ConfigInput({ id, label, value, onChange }: ConfigInputProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-gray-300">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 bg-gray-900 border-gray-700 text-white"
      />
    </div>
  )
}