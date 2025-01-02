import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ReactElement } from "react"

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactElement
}

const InputWithIcon = ({ icon, className, ...props }: InputWithIconProps) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <Input
        className={cn(icon && "pl-10", className)}
        {...props}
      />
    </div>
  )
}

export { InputWithIcon }