export const STORAGE_KEYS = {
  theme: "infinity-theme",
  settings: "comlog_settings",
  storedLists: "comlog_stored_lists",
  activePair: "comlog_active_pair",
  sessions: "comlog_sessions",
  activeSessionId: "comlog_active_session_id",
  sidebarState: "sidebar_state",
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
