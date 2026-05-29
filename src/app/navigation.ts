import { appRoutes, type AppRouteStatus } from "./routes"
import type { LucideIcon } from "lucide-react"

export type AppNavItem = {
  title: string
  url: string
  icon: LucideIcon
  status?: AppRouteStatus
}

export type AppNavGroup = {
  label: string
  items: AppNavItem[]
}

const sidebarGroupLabels = ["Lists", "Play"] as const

function getStatus(route: (typeof appRoutes)[number]): AppRouteStatus | undefined {
  return "status" in route ? route.status as AppRouteStatus : undefined
}

export const navGroups: AppNavGroup[] = sidebarGroupLabels.map((label) => ({
  label,
  items: appRoutes
    .filter((route) => route.showInSidebar && route.navGroup === label)
    .map((route) => ({
      title: route.title,
      url: route.path,
      icon: route.icon,
      status: getStatus(route),
    })),
}))

const settingsRoute = appRoutes.find((route) => route.id === "settings")

if (!settingsRoute) {
  throw new Error("Settings route is not registered")
}

export const settingsNavItem: AppNavItem = {
  title: settingsRoute.title,
  url: settingsRoute.path,
  icon: settingsRoute.icon,
  status: getStatus(settingsRoute),
}
