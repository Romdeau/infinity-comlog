import * as React from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { STORAGE_KEYS } from "@/shared/storage/storage-keys"
import { validateSettingsStorage } from "@/shared/storage/storage-schemas"
import type { MeasurementUnit } from "@/shared/types/metadata"

export type { MeasurementUnit }

export interface AppSettings {
  measurementUnit: MeasurementUnit
}

const DEFAULT_SETTINGS: AppSettings = {
  measurementUnit: "imperial"
}

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (newSettings: Partial<AppSettings>) => void
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS, {
    validate: validateSettingsStorage,
  })

  const updateSettings = React.useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [setSettings])

  const value = React.useMemo(() => ({ settings, updateSettings }), [settings, updateSettings])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = React.useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
