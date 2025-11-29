import * as React from "react"
import { cn } from "@/lib/utils/tailwind-merge"

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full bg-background font-medium px-3 py-2 text-base border placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400 md:text-sm transition-all",
          // default 
          "border-gray-300 text-gray-800",
          // focus 
          "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600",
          // error 
          error && "border-red-600 focus:ring-red-600 focus:border-red-600",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
