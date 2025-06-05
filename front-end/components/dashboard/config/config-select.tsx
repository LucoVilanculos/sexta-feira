import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ConfigSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{
    value: string
    label: string
  }>
}

export function ConfigSelect({
  id,
  label,
  value,
  onChange,
  options,
}: ConfigSelectProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-gray-300">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="mt-1 w-full bg-gray-900 border-gray-700 text-white"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 