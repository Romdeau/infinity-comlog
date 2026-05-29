/**
 * Simple hook for local storage persistence.
 * Designed to be compatible with future account systems by abstracting the storage key.
 */
import { useCallback, useState } from "react";
import { readJson, writeJson, type StorageMigration, type StorageValidator, type StorageWarningReporter } from "@/shared/storage/storage-adapter";

type UseLocalStorageOptions<T> = {
  validate?: StorageValidator<T>
  migrate?: StorageMigration
  writeMigrated?: boolean
  onWarning?: StorageWarningReporter
}

export function useLocalStorage<T>(key: string, initialValue: T, options: UseLocalStorageOptions<T> = {}) {
  const { validate, migrate, writeMigrated, onWarning } = options

  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    return readJson(key, initialValue, { validate, migrate, writeMigrated, onWarning })
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((previousValue) => {
      try {
        const valueToStore = value instanceof Function ? value(previousValue) : value;
        writeJson(key, valueToStore, { onWarning });
        return valueToStore;
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
        return previousValue;
      }
    });
  }, [key, onWarning]);

  return [storedValue, setValue] as const;
}
