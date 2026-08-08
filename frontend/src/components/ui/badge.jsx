import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-white text-black hover:bg-white/80",
        secondary:
          "border-transparent bg-white/5 text-white hover:bg-white/10",
        destructive:
          "border-transparent bg-rose-500 text-white hover:bg-rose-500/80",
        outline: "text-white border-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
