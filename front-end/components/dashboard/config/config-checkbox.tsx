import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ConfigCheckboxProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function ConfigCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
}: ConfigCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label
        htmlFor={id}
        className="text-gray-300 cursor-pointer"
      >
        {label}
      </Label>
    </div>
  )
} 