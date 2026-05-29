import type { LazyExoticComponent, ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import {
  BarChart3Icon,
  BookOpenIcon,
  LayersIcon,
  Settings2Icon,
  SwordIcon,
  TablePropertiesIcon,
} from "lucide-react"
import {
  ArmyListViewPage,
  ArmyListsPage,
  GameSequencePage,
  ListAnalysisPage,
  OrderReferencePage,
  SettingsPage,
} from "./route-components"

export type AppRouteStatus = "Alpha"
export type AppNavGroupLabel = "Lists" | "Play" | "Preferences"

export type AppRouteDefinition = {
  id: string
  path: `/${string}`
  routePath: string
  title: string
  section: AppNavGroupLabel | "Workspace"
  description: string
  status?: AppRouteStatus
  icon: LucideIcon
  navGroup: AppNavGroupLabel | null
  showInSidebar: boolean
  component: LazyExoticComponent<ComponentType>
}

export const appRoutes = [
  {
    id: "army-lists",
    path: "/army-lists",
    routePath: "army-lists",
    title: "Army Lists",
    section: "Lists",
    description: "Import, compare, and manage the lists you want to bring into a game.",
    icon: LayersIcon,
    navGroup: "Lists",
    showInSidebar: true,
    component: ArmyListsPage,
  },
  {
    id: "army-list-view",
    path: "/army-list-view",
    routePath: "army-list-view",
    title: "List View",
    section: "Lists",
    description: "Inspect roster details, combat groups, and a cleaner read-only view of each list.",
    status: "Alpha",
    icon: TablePropertiesIcon,
    navGroup: "Lists",
    showInSidebar: true,
    component: ArmyListViewPage,
  },
  {
    id: "list-analysis",
    path: "/list-analysis",
    routePath: "list-analysis",
    title: "List Analysis",
    section: "Lists",
    description: "Review composition, specialists, orders, and troop mix across your active lists.",
    status: "Alpha",
    icon: BarChart3Icon,
    navGroup: "Lists",
    showInSidebar: true,
    component: ListAnalysisPage,
  },
  {
    id: "game-sequence",
    path: "/game-sequence",
    routePath: "game-sequence",
    title: "Game Sequence",
    section: "Play",
    description: "Track scenario setup, turn flow, and the state of the current session.",
    icon: SwordIcon,
    navGroup: "Play",
    showInSidebar: true,
    component: GameSequencePage,
  },
  {
    id: "order-reference",
    path: "/order-reference",
    routePath: "order-reference",
    title: "Order Reference",
    section: "Play",
    description: "Keep the turn structure and key sequence reminders close at hand during a game.",
    icon: BookOpenIcon,
    navGroup: "Play",
    showInSidebar: true,
    component: OrderReferencePage,
  },
  {
    id: "settings",
    path: "/settings",
    routePath: "settings",
    title: "Settings",
    section: "Preferences",
    description: "Manage display preferences, measurement units, and local application data.",
    icon: Settings2Icon,
    navGroup: "Preferences",
    showInSidebar: false,
    component: SettingsPage,
  },
] as const satisfies readonly AppRouteDefinition[]

export type AppRoute = (typeof appRoutes)[number]
export type AppRouteId = AppRoute["id"]
export type AppRoutePath = AppRoute["path"]

export const defaultRoutePath = "/army-lists" satisfies AppRoutePath

export const fallbackRouteMeta = {
  title: "Infinity Comlog",
  section: "Workspace",
  description: "Plan lists, reference game flow, and manage match information.",
  status: undefined,
} as const

export type AppRouteMeta = {
  title: string
  section: AppRouteDefinition["section"]
  description: string
  status?: AppRouteStatus
}

export function getAppRoute(pathname: string): AppRoute | undefined {
  return appRoutes.find((route) => route.path === pathname)
}

export function getRouteMeta(pathname: string): AppRouteMeta {
  const route = getAppRoute(pathname)
  if (!route) return fallbackRouteMeta

  return {
    title: route.title,
    section: route.section,
    description: route.description,
    status: "status" in route ? route.status : undefined,
  }
}
