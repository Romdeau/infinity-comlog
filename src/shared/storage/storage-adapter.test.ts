import { describe, expect, it, vi } from "vitest"

import { readJson, writeJson } from "./storage-adapter"
import { migrateActivePairStorage, validateActivePairStorage, validateSettingsStorage } from "./storage-schemas"

function createMemoryStorage(initialValues: Record<string, string> = {}) {
  const values = new Map(Object.entries(initialValues))

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value)
    }),
  }
}

describe("storage adapter", () => {
  it("falls back and reports invalid JSON", () => {
    const storage = createMemoryStorage({ settings: "{" })
    const onWarning = vi.fn()

    const value = readJson("settings", { measurementUnit: "imperial" }, {
      storage,
      onWarning,
      validate: validateSettingsStorage,
    })

    expect(value).toEqual({ measurementUnit: "imperial" })
    expect(onWarning).toHaveBeenCalledWith(expect.objectContaining({ code: "invalid-json", key: "settings" }))
  })

  it("falls back when validation fails", () => {
    const storage = createMemoryStorage({ settings: JSON.stringify({ measurementUnit: "yards" }) })
    const onWarning = vi.fn()

    const value = readJson("settings", { measurementUnit: "imperial" }, {
      storage,
      onWarning,
      validate: validateSettingsStorage,
    })

    expect(value).toEqual({ measurementUnit: "imperial" })
    expect(onWarning).toHaveBeenCalledWith(expect.objectContaining({ code: "validation-failed", key: "settings" }))
  })

  it("migrates active pair storage and writes the migrated value", () => {
    const storage = createMemoryStorage({ pair: JSON.stringify({ listAId: "a-id", listBId: "b-id" }) })

    const value = readJson("pair", { a: null, b: null }, {
      storage,
      validate: validateActivePairStorage,
      migrate: migrateActivePairStorage,
      writeMigrated: true,
    })

    expect(value).toEqual({ a: "a-id", b: "b-id" })
    expect(storage.setItem).toHaveBeenCalledWith("pair", JSON.stringify({ a: "a-id", b: "b-id" }))
  })

  it("reports write failures", () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(() => {
        throw new Error("quota")
      }),
    }
    const onWarning = vi.fn()

    expect(writeJson("key", { value: true }, { storage, onWarning })).toBe(false)
    expect(onWarning).toHaveBeenCalledWith(expect.objectContaining({ code: "write-failed", key: "key" }))
  })
})
