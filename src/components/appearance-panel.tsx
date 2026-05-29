import { CheckIcon, MoonIcon, MonitorIcon, SunIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAppearance, type Mode } from "@/components/appearance-provider"
import { THEMES } from "@/app/themes"

const MODE_OPTIONS: { value: Mode; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

/**
 * Full Appearance configuration surface for the Settings page: a grid of theme
 * cards (aesthetic) plus a Light/Dark/System segmented control (luminance).
 */
export function AppearancePanel() {
  const { themeId, setThemeId, mode, setMode } = useAppearance()

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-foreground">Theme</h2>
          <p className="text-sm text-muted-foreground">
            Each theme changes color, typography, surface texture and motion — not just the palette.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {THEMES.map((theme) => {
            const isActive = theme.id === themeId
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id)}
                aria-pressed={isActive}
                className={cn(
                  "group flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border/70 bg-background hover:border-primary/40"
                )}
              >
                <span
                  data-theme={theme.id}
                  className="mt-0.5 flex shrink-0 overflow-hidden rounded border border-border"
                  aria-hidden
                >
                  {theme.swatches.map((swatch, i) => (
                    <span key={i} className="size-6" style={{ background: swatch }} />
                  ))}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-semibold tracking-tight">
                      {theme.label}
                    </span>
                    {isActive && <CheckIcon className="size-4 shrink-0 text-primary" />}
                  </span>
                  <span className="mt-0.5 block text-xs leading-tight text-muted-foreground">
                    {theme.blurb}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-foreground">Color Mode</h2>
          <p className="text-sm text-muted-foreground">
            Light, dark, or follow your system setting.
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="Color mode"
          className="inline-flex rounded-lg border border-border/70 bg-muted/30 p-1"
        >
          {MODE_OPTIONS.map((option) => {
            const isActive = mode === option.value
            const Icon = option.icon
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setMode(option.value)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                {option.label}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
