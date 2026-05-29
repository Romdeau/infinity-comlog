import type { ThemeId } from "@/components/appearance-provider"

export interface ThemeMeta {
  id: ThemeId
  /** Human-readable label shown in the picker. */
  label: string
  /** One-line description for the picker. */
  blurb: string
  /** CSS color token reference used for the picker's accent swatch. */
  accent: string
  /** Token references for a mini multi-swatch preview. */
  swatches: readonly string[]
  /** Whether the theme offers a meaningful light mode. */
  supportsLight: boolean
}

/**
 * Data-driven registry of all available themes. The theme picker and any
 * theme-aware logic iterate over this list so adding a theme is a one-line
 * change here plus its CSS token block in `index.css`.
 */
export const THEMES: readonly ThemeMeta[] = [
  {
    id: "hardscifi",
    label: "Hard Sci-Fi",
    blurb: "Clinical mission-computer command interface.",
    accent: "var(--primary)",
    swatches: ["var(--background)", "var(--primary)", "var(--accent)"],
    supportsLight: true,
  },
  {
    id: "orbital",
    label: "Orbital Agency",
    blurb: "Analog mission-control instrument panels.",
    accent: "var(--primary)",
    swatches: ["var(--background)", "var(--primary)", "var(--destructive)"],
    supportsLight: true,
  },
  {
    id: "rebellion",
    label: "Rebellion",
    blurb: "Utilitarian insurgent terminal, amber CRT.",
    accent: "var(--primary)",
    swatches: ["var(--background)", "var(--primary)", "var(--status-warning)"],
    supportsLight: true,
  },
  {
    id: "drifter",
    label: "Drifter",
    blurb: "Jazzy retro-future bounty terminal.",
    accent: "var(--primary)",
    swatches: ["var(--background)", "var(--primary)", "var(--accent)"],
    supportsLight: true,
  },
] as const

export function getThemeMeta(id: ThemeId): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
