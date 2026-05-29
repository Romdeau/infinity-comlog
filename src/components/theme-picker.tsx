import { PaletteIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppearance } from "@/components/appearance-provider"
import { THEMES } from "@/app/themes"
import { cn } from "@/lib/utils"

/**
 * Theme aesthetic picker. Lists every theme from the registry with a label,
 * blurb and a mini multi-swatch preview. Selecting a theme sets `themeId`
 * (luminance is handled separately by ModeToggle).
 */
export function ThemePicker() {
  const { themeId, setThemeId } = useAppearance()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <PaletteIcon className="size-4" />
          <span className="sr-only">Choose theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Appearance theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setThemeId(theme.id)}
            className={cn(
              "flex items-start gap-2.5",
              theme.id === themeId && "bg-accent/60"
            )}
          >
            <span
              data-theme={theme.id}
              className="mt-0.5 flex shrink-0 overflow-hidden rounded-sm border border-border"
              aria-hidden
            >
              {theme.swatches.map((swatch, i) => (
                <span
                  key={i}
                  className="size-3.5"
                  style={{ background: swatch }}
                />
              ))}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium leading-tight">
                {theme.label}
              </span>
              <span className="block text-xs leading-tight text-muted-foreground">
                {theme.blurb}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
