import type { LucideIcon } from "lucide-react"
import {
  BarChart3Icon,
  BookOpenIcon,
  LayersIcon,
  Settings2Icon,
  SwordIcon,
  TablePropertiesIcon,
} from "lucide-react"

export type AppRouteMeta = {
  title: string
  section: string
  description: string
  status?: "Alpha"
}

export type AppNavItem = {
  title: string
  url: string
  icon: LucideIcon
  status?: "Alpha"
}

export type AppNavGroup = {
  label: string
  items: AppNavItem[]
}

export const routeMeta: Record<string, AppRouteMeta> = {
  "/army-lists": {
    title: "Army Lists",
    section: "Lists",
    description: "Import, compare, and manage the lists you want to bring into a game.",
  },
  "/army-list-view": {
    title: "List View",
    section: "Lists",
    description: "Inspect roster details, combat groups, and a cleaner read-only view of each list.",
    status: "Alpha",
  },
  "/list-analysis": {
    title: "List Analysis",
    section: "Lists",
    description: "Review composition, specialists, orders, and troop mix across your active lists.",
    status: "Alpha",
  },
  "/game-sequence": {
    title: "Game Sequence",
    section: "Play",
    description: "Track scenario setup, turn flow, and the state of the current session.",
  },
  "/order-reference": {
    title: "Order Reference",
    section: "Play",
    description: "Keep the turn structure and key sequence reminders close at hand during a game.",
  },
  "/settings": {
    title: "Settings",
    section: "Preferences",
    description: "Manage display preferences, measurement units, and local application data.",
  },
}

export const navGroups: AppNavGroup[] = [
  {
    label: "Lists",
    items: [
      { title: "Army Lists", url: "/army-lists", icon: LayersIcon },
      { title: "List View", url: "/army-list-view", icon: TablePropertiesIcon, status: "Alpha" },
      { title: "List Analysis", url: "/list-analysis", icon: BarChart3Icon, status: "Alpha" },
    ],
  },
  {
    label: "Play",
    items: [
      { title: "Game Sequence", url: "/game-sequence", icon: SwordIcon },
      { title: "Order Reference", url: "/order-reference", icon: BookOpenIcon },
    ],
  },
]

export const settingsNavItem: AppNavItem = {
  title: "Settings",
  url: "/settings",
  icon: Settings2Icon,
}

export function getRouteMeta(pathname: string): AppRouteMeta {
  return routeMeta[pathname] ?? {
    title: "Infinity Comlog",
    section: "Workspace",
    description: "Plan lists, reference game flow, and manage match information.",
  }
}
