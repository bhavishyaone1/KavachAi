import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils.js"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black shadow hover:bg-white/95 active:scale-[0.98] cursor-pointer",
        destructive:
          "bg-rose-500 text-white shadow-sm hover:bg-rose-500/90 active:scale-[0.98] cursor-pointer",
        outline:
          "border border-white/10 bg-transparent shadow-sm hover:bg-white/5 text-white active:scale-[0.98] cursor-pointer",
        secondary:
          "bg-white/5 border border-white/5 text-white hover:bg-white/10 active:scale-[0.98] cursor-pointer",
        ghost: "hover:bg-white/5 text-white/70 hover:text-white cursor-pointer",
        link: "text-[#3b82f6] underline-offset-4 hover:underline cursor-pointer",
      },
      size: {
        default: "h-11 px-5 py-3",
        sm: "h-9 rounded-lg px-3 text-[11px]",
        lg: "h-12 rounded-xl px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
