import * as React from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { InfoIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface StepProps {
  label: string
  info?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
  size?: "sm" | "md"
}

export function GameStep({
  label,
  info,
  checked,
  onCheckedChange,
  className,
  size = "md"
}: StepProps) {
  const labelSize = size === "sm" ? "text-xs" : "text-sm"
  const padding = size === "sm" ? "p-1.5" : "p-3 border rounded-lg hover:bg-muted/50 transition-colors"

  return (
    <label className={cn("group flex items-center space-x-3 cursor-pointer", padding, className)}>
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <div className="flex items-center gap-1">
        <span className={cn(
          labelSize,
          "font-medium leading-none transition-all",
          checked && "text-muted-foreground line-through opacity-70"
        )}>
          {label}
        </span>
        {info && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-muted-foreground hover:text-primary transition-colors focus:outline-none ml-1">
                <InfoIcon className="size-3.5" />
                <span className="sr-only">Help</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="text-xs">
              {info}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </label>
  )
}

interface GameGroupProps {
  label: string
  info?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  children: React.ReactNode
  value: string
  defaultOpen?: boolean
  className?: string
}

export function GameGroup({
  label,
  info,
  checked,
  onCheckedChange,
  children,
  value,
  defaultOpen = false,
  className
}: GameGroupProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? value : undefined}
      className={cn("w-full", className)}
    >
      <AccordionItem value={value} className="border-none">
        <div className="flex items-center gap-3 py-2 px-1.5">
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <AccordionTrigger className="flex-1 py-1 hover:no-underline font-semibold text-sm">
            <div className="flex items-center gap-2">
              <span className={cn(
                "transition-all",
                checked && "text-muted-foreground line-through opacity-70"
              )}>
                {label}
              </span>
              {info && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-muted-foreground hover:text-primary transition-colors focus:outline-none ml-1">
                      <InfoIcon className="size-3.5" />
                      <span className="sr-only">Help</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="text-xs">
                    {info}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </AccordionTrigger>
        </div>
        <AccordionContent className="pl-7 pr-0 space-y-4 pt-1 pb-2 border-l ml-3 border-muted/50">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
