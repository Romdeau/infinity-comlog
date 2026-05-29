import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Suspense } from "react"
import { Settings2Icon } from "lucide-react"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusPip } from "@/components/system"
import { defaultRoutePath } from "@/app/routes"
import { getRouteMeta } from "@/app/routes"
import { settingsNavItem } from "@/app/navigation"
import { useArmy } from "@/context/army-context"
import { useGame } from "@/context/game-context"
import { AppSidebar } from "./app-sidebar"
import { ArmyImportNotifications } from "./army-import-notifications"
import { ModeToggle } from "./mode-toggle"
import { ThemePicker } from "./theme-picker"

export function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const page = getRouteMeta(location.pathname)
  const { lists } = useArmy()
  const { activeSession } = useGame()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ArmyImportNotifications />
        <header className="border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex h-14 items-center gap-3 px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden sm:block">
                  <Link to={defaultRoutePath} className="text-muted-foreground transition-colors hover:text-foreground">
                    Infinity Comlog
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{page.section}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <ThemePicker />
              <ModeToggle />
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => navigate(settingsNavItem.url)}
                aria-label="Open settings"
              >
                <Settings2Icon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-end md:justify-between md:px-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-semibold tracking-[var(--text-display-tracking)]">
                  {page.title}
                </h1>
                {page.status && (
                  <Badge variant="outline" className="text-xs">
                    {page.status}
                  </Badge>
                )}
              </div>
              <p className="max-w-2xl text-sm text-muted-foreground">{page.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <StatusPip
                status={lists.listA ? "complete" : "pending"}
                label={lists.listA ? "List A loaded" : "List A empty"}
              />
              <StatusPip
                status={lists.listB ? "complete" : "pending"}
                label={lists.listB ? "List B loaded" : "List B empty"}
              />
              {activeSession && (
                <StatusPip status="active" label={`Session: ${activeSession.name}`} />
              )}
            </div>
          </div>
        </header>
        <main className="grid-bg flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
          <Suspense fallback={
            <div className="flex flex-col gap-4">
              <Skeleton className="h-8 w-[200px]" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-[200px] rounded-xl" />
                <Skeleton className="h-[200px] rounded-xl" />
                <Skeleton className="h-[200px] rounded-xl" />
              </div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
