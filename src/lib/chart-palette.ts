import * as React from "react"

import { useAppearance } from "@/components/appearance-provider"

/** Number of chart color tokens defined per theme (`--chart-1..7`). */
const CHART_TOKEN_COUNT = 7

/** Reads a CSS custom property from the document root. */
function readVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return value || fallback
}

/**
 * Resolves the current theme's chart palette (`--chart-1..7`) from CSS vars so
 * recharts series re-theme when the appearance changes.
 */
export function getChartPalette(): string[] {
  const palette: string[] = []
  for (let i = 1; i <= CHART_TOKEN_COUNT; i += 1) {
    palette.push(readVar(`--chart-${i}`, "currentColor"))
  }
  return palette
}

/** Resolves chart chrome colors (grid line, surface, border) from tokens. */
export function getChartChrome() {
  return {
    grid: readVar("--grid-line", "rgba(148, 163, 184, 0.18)"),
    surface: readVar("--card", "#ffffff"),
    border: readVar("--border", "#cbd5e1"),
    cursor: readVar("--muted", "rgba(148, 163, 184, 0.08)"),
  }
}

/**
 * Returns the active chart palette + chrome, recomputed whenever the theme or
 * resolved mode changes so charts stay in sync with the appearance system.
 */
export function useChartPalette() {
  const { themeId, resolvedMode } = useAppearance()
  return React.useMemo(
    () => ({ palette: getChartPalette(), chrome: getChartChrome() }),
    // Re-read CSS vars when the theme/mode changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themeId, resolvedMode]
  )
}
