import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface AccordionItemProps {
  open?: boolean
  onToggle?: () => void
}

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & AccordionItemProps
>(({ className, children, open, onToggle, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b border-border", className)}
    {...props}
  >
    {children}
  </div>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { open?: boolean }
>(({ className, children, open, ...props }, ref) => (
  <button
    ref={ref}
    aria-expanded={open}
    className={cn(
      "flex w-full items-center justify-between py-4 text-left font-medium transition-colors hover:text-primary",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className={cn(
        "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
        open && "rotate-180",
      )}
    />
  </button>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { open?: boolean }
>(({ className, children, open, ...props }, ref) => {
  if (!open) return null
  return (
    <div
      ref={ref}
      className={cn("pb-4 text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  )
})
AccordionContent.displayName = "AccordionContent"

export { AccordionItem, AccordionTrigger, AccordionContent }
