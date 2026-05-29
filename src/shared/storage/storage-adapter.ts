type JsonStorage = Pick<Storage, "getItem" | "setItem">

export type StorageWarningCode =
  | "storage-unavailable"
  | "invalid-json"
  | "migration-failed"
  | "validation-failed"
  | "write-failed"

export type StorageWarning = {
  key: string
  code: StorageWarningCode
  message: string
  error?: unknown
}

export type StorageWarningReporter = (warning: StorageWarning) => void
export type StorageValidator<T> = (value: unknown) => T | undefined
export type StorageMigration = (value: unknown) => unknown

type StorageAdapterOptions = {
  storage?: JsonStorage
  onWarning?: StorageWarningReporter
}

type ReadJsonOptions<T> = StorageAdapterOptions & {
  validate?: StorageValidator<T>
  migrate?: StorageMigration
  writeMigrated?: boolean
}

const defaultReporter: StorageWarningReporter = (warning) => {
  console.warn(warning.message, warning.error)
}

function report(warning: StorageWarning, onWarning: StorageWarningReporter = defaultReporter) {
  onWarning(warning)
}

function getStorage(storage?: JsonStorage): JsonStorage | undefined {
  if (storage) return storage
  if (typeof window === "undefined") return undefined
  return window.localStorage
}

export function readJson<T>(key: string, fallback: T, options: ReadJsonOptions<T> = {}): T {
  const storage = getStorage(options.storage)

  if (!storage) {
    report({ key, code: "storage-unavailable", message: `Storage unavailable for key "${key}".` }, options.onWarning)
    return fallback
  }

  let raw: string | null
  try {
    raw = storage.getItem(key)
  } catch (error) {
    report({ key, code: "storage-unavailable", message: `Error reading storage key "${key}".`, error }, options.onWarning)
    return fallback
  }

  if (raw === null) return fallback

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (error) {
    report({ key, code: "invalid-json", message: `Invalid JSON in storage key "${key}".`, error }, options.onWarning)
    return fallback
  }

  let migrated = parsed
  if (options.migrate) {
    try {
      migrated = options.migrate(parsed)
    } catch (error) {
      report({ key, code: "migration-failed", message: `Migration failed for storage key "${key}".`, error }, options.onWarning)
      return fallback
    }
  }

  const value = options.validate ? options.validate(migrated) : (migrated as T)
  if (value === undefined) {
    report({ key, code: "validation-failed", message: `Validation failed for storage key "${key}".` }, options.onWarning)
    return fallback
  }

  if (options.writeMigrated && migrated !== parsed) {
    writeJson(key, value, { storage, onWarning: options.onWarning })
  }

  return value
}

export function writeJson<T>(key: string, value: T, options: StorageAdapterOptions = {}): boolean {
  const storage = getStorage(options.storage)

  if (!storage) {
    report({ key, code: "storage-unavailable", message: `Storage unavailable for key "${key}".` }, options.onWarning)
    return false
  }

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    report({ key, code: "write-failed", message: `Error setting storage key "${key}".`, error }, options.onWarning)
    return false
  }
}
