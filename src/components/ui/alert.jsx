import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-white text-[#0F172A] border-slate-200/50",
        destructive:
          "text-[#EF4444] bg-[#FEF2F2] border-[#FCA5A5] [&>svg]:text-current *:data-[slot=alert-description]:text-[#EF4444]/90",
        danger:
          "text-[#EF4444] bg-[#FEF2F2] border-[#FCA5A5] [&>svg]:text-current *:data-[slot=alert-description]:text-[#EF4444]/90",
        warning:
          "text-[#D97706] bg-[#FFF8EB] border-[#FCD34D] [&>svg]:text-current *:data-[slot=alert-description]:text-[#D97706]/90",
        success:
          "text-[#16A34A] bg-[#F0FDF4] border-[#86EFAC] [&>svg]:text-current *:data-[slot=alert-description]:text-[#16A34A]/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props} />
  );
}

function AlertTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
      {...props} />
  );
}

function AlertDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props} />
  );
}

export { Alert, AlertTitle, AlertDescription }
