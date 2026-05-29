import type { GameSession } from "@/context/game-context-core"
import type { StoredArmyList } from "@/lib/unit-service"
import type { MeasurementUnit } from "@/shared/types/metadata"

export type StoredSettings = {
  measurementUnit: MeasurementUnit
}

export type StoredActivePair = {
  a: string | null
  b: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
}

function asNullableString(value: unknown): string | null | undefined {
  if (value === null) return null
  if (typeof value === "string") return value
  return undefined
}

export function validateSettingsStorage(value: unknown): StoredSettings | undefined {
  if (!isRecord(value)) return undefined
  if (value.measurementUnit !== "imperial" && value.measurementUnit !== "metric") return undefined

  return { measurementUnit: value.measurementUnit }
}

export function validateStoredListsStorage(value: unknown): Record<string, StoredArmyList> | undefined {
  if (!isRecord(value)) return undefined

  const entries = Object.entries(value).filter(([, list]) => isRecord(list))
  return Object.fromEntries(entries) as Record<string, StoredArmyList>
}

export function migrateActivePairStorage(value: unknown): unknown {
  if (!isRecord(value)) return value

  if ("listAId" in value || "listBId" in value) {
    return {
      a: typeof value.listAId === "string" ? value.listAId : null,
      b: typeof value.listBId === "string" ? value.listBId : null,
    }
  }

  return value
}

export function validateActivePairStorage(value: unknown): StoredActivePair | undefined {
  if (!isRecord(value)) return undefined

  const a = asNullableString(value.a)
  const b = asNullableString(value.b)
  if (a === undefined || b === undefined) return undefined

  return { a, b }
}

export function validateSessionsStorage(value: unknown): Record<string, GameSession> | undefined {
  if (!isRecord(value)) return undefined

  const entries = Object.entries(value).filter(([, session]) => isRecord(session) && typeof session.id === "string")
  return Object.fromEntries(entries) as Record<string, GameSession>
}

export function validateActiveSessionIdStorage(value: unknown): string | null | undefined {
  return asNullableString(value)
}
