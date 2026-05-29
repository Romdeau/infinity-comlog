import type { ReactNode } from "react"

import { AppearanceProvider } from "@/components/appearance-provider"
import { ArmyProvider } from "@/context/army-context"
import { GameProvider } from "@/context/game-context"
import { SettingsProvider } from "@/context/settings-context"
import { STORAGE_KEYS } from "@/shared/storage/storage-keys"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppearanceProvider
      defaultThemeId="hardscifi"
      defaultMode="dark"
      storageKey={STORAGE_KEYS.theme}
    >
      <SettingsProvider>
        <ArmyProvider>
          <GameProvider>{children}</GameProvider>
        </ArmyProvider>
      </SettingsProvider>
    </AppearanceProvider>
  )
}
