/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"

export type ThemeId = "hardscifi" | "orbital" | "rebellion" | "drifter"
export type Mode = "light" | "dark" | "system"

const THEME_IDS: readonly ThemeId[] = [
  "hardscifi",
  "orbital",
  "rebellion",
  "drifter",
]
const MODES: readonly Mode[] = ["light", "dark", "system"]

export interface AppearanceState {
  themeId: ThemeId
  mode: Mode
  resolvedMode: "light" | "dark"
  setThemeId: (t: ThemeId) => void
  setMode: (m: Mode) => void
}

interface StoredAppearance {
  themeId: ThemeId
  mode: Mode
}

const initialState: AppearanceState = {
  themeId: "hardscifi",
  mode: "dark",
  resolvedMode: "dark",
  setThemeId: () => null,
  setMode: () => null,
}

const AppearanceContext = createContext<AppearanceState>(initialState)

const DARK_QUERY = "(prefers-color-scheme: dark)"

function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEME_IDS.includes(value as ThemeId)
}

function isMode(value: unknown): value is Mode {
  return typeof value === "string" && MODES.includes(value as Mode)
}

/**
 * Read the stored appearance, migrating the legacy bare-string format
 * (`"dark" | "light" | "system"`) into `{ themeId: "hardscifi", mode }`.
 */
function readStored(
  storageKey: string,
  defaultThemeId: ThemeId,
  defaultMode: Mode
): StoredAppearance {
  let raw: string | null
  try {
    raw = window.localStorage.getItem(storageKey)
  } catch {
    raw = null
  }
  if (!raw) return { themeId: defaultThemeId, mode: defaultMode }

  // Legacy bare string (old theme-provider format).
  if (isMode(raw)) {
    return { themeId: "hardscifi", mode: raw }
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredAppearance>
    return {
      themeId: isThemeId(parsed.themeId) ? parsed.themeId : defaultThemeId,
      mode: isMode(parsed.mode) ? parsed.mode : defaultMode,
    }
  } catch {
    return { themeId: defaultThemeId, mode: defaultMode }
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia?.(DARK_QUERY).matches ?? false
}

/** Subscribe to OS color-scheme changes via useSyncExternalStore. */
function subscribeSystemDark(onChange: () => void): () => void {
  const mql = window.matchMedia(DARK_QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export function AppearanceProvider({
  children,
  defaultThemeId = "hardscifi",
  defaultMode = "dark",
  storageKey = "infinity-theme",
}: {
  children: React.ReactNode
  defaultThemeId?: ThemeId
  defaultMode?: Mode
  storageKey?: string
}) {
  const [{ themeId, mode }, setStored] = useState<StoredAppearance>(() =>
    readStored(storageKey, defaultThemeId, defaultMode)
  )
  // Live OS preference, only consulted when mode === "system".
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    systemPrefersDark,
    () => false
  )

  const resolvedMode: "light" | "dark" =
    mode === "system" ? (systemDark ? "dark" : "light") : mode

  // Apply theme + resolved mode to the DOM whenever they change.
  useEffect(() => {
    const root = window.document.documentElement
    root.setAttribute("data-theme", themeId)
    root.classList.toggle("dark", resolvedMode === "dark")
    root.style.colorScheme = resolvedMode
  }, [themeId, resolvedMode])

  const persist = (next: StoredAppearance) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      /* ignore quota / privacy errors */
    }
  }

  const value = useMemo<AppearanceState>(
    () => ({
      themeId,
      mode,
      resolvedMode,
      setThemeId: (t: ThemeId) => {
        setStored((prev) => {
          const next = { ...prev, themeId: t }
          persist(next)
          return next
        })
      },
      setMode: (m: Mode) => {
        setStored((prev) => {
          const next = { ...prev, mode: m }
          persist(next)
          return next
        })
      },
    }),
    // persist closes over storageKey only; identity is stable enough here
    [themeId, mode, resolvedMode] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  )
}

export const useAppearance = (): AppearanceState => {
  const context = useContext(AppearanceContext)
  if (context === undefined) {
    throw new Error("useAppearance must be used within an AppearanceProvider")
  }
  return context
}
