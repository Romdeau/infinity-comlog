import { Outlet, useLocation } from "react-router-dom"
import { Suspense } from "react"
import {
  Search,
} from "lucide-react"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { AppSidebar } from "./app-sidebar"
import { GlobalNotifications } from "./global-notifications"

export function DashboardLayout() {
  const location = useLocation()

  const getBreadcrumb = () => {
    const path = location.pathname
    if (path === "/army-lists") return "Army Lists"
    if (path === "/army-list-view") return (
      <div className="flex items-center gap-1.5">
        <span>List View</span>
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">(Alpha)</span>
      </div>
    )
    if (path === "/list-analysis") return (
      <div className="flex items-center gap-1.5">
        <span>List Analysis</span>
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">(Alpha)</span>
      </div>
    )
    if (path === "/game-sequence") return "Game Sequence"
    if (path === "/order-reference") return "Order Reference"
    if (path === "/settings") return "Settings"
    return "Infinity Comlog"
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <GlobalNotifications />
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#/">
                    Infinity Comlog
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getBreadcrumb()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-4 md:gap-2 lg:gap-4">
            <form className="hidden sm:flex flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search wiki..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
