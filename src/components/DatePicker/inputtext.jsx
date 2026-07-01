import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "./utils"

const inputTextVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        normal: "h-10",
        small: "h-8 text-xs",
        large: "h-12 text-lg",
      },
      fluid: {
        true: "w-full",
      }
    },
    defaultVariants: {
      size: "normal",
    },
  }
)

const InputText = React.forwardRef(({ className, size, variant, fluid, ...props }, ref) => {
  return (
    <input
      className={cn(inputTextVariants({ size, fluid, className }))}
      ref={ref}
      {...props}
    />
  )
})
InputText.displayName = "InputText"

export { InputText, inputTextVariants }
