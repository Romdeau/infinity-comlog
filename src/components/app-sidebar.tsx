import {
  InfoIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Link, useLocation } from "react-router-dom"
import { useArmy } from "@/context/army-context"
import { cn } from "@/lib/utils"
import { defaultRoutePath } from "@/app/routes"
import { navGroups, settingsNavItem } from "@/app/navigation"
import { ThemeToggle } from "./theme-toggle"

export function AppSidebar() {
  const location = useLocation()
  const { storedLists, importErrors } = useArmy()
  const savedListCount = Object.keys(storedLists).length

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
              <Link to={defaultRoutePath}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                  <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Logo" className="size-6" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Infinity Comlog</span>
                  <span className="text-xs text-sidebar-foreground/60">Frontend companion for Infinity N5</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate">{item.title}</span>
                          {item.status && (
                            <Badge
                              variant="outline"
                              className="h-5 px-1.5 text-xs group-data-[collapsible=icon]:hidden"
                            >
                              {item.status}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === settingsNavItem.url}
              tooltip={settingsNavItem.title}
            >
              <Link to={settingsNavItem.url}>
                <settingsNavItem.icon />
                <span>{settingsNavItem.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex items-center justify-center gap-2 px-2 py-1 group-data-[collapsible=icon]:px-0">
            <ThemeToggle />
            <span className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
              Theme
            </span>
          </SidebarMenuItem>
          <SidebarMenuItem className="px-2 py-1 group-data-[collapsible=icon]:hidden">
            <div className="rounded-lg border border-sidebar-border/70 bg-sidebar-accent/35 p-3 text-xs text-sidebar-foreground/75">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Local data</span>
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {savedListCount} saved
                </Badge>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-sidebar-foreground/60">
                <span>Import warnings</span>
                <span className={cn(importErrors.length > 0 && "text-destructive")}>{importErrors.length}</span>
              </div>
              <div className="mt-3 flex gap-2 text-xs leading-relaxed text-sidebar-foreground/55">
                <InfoIcon className="mt-0.5 size-3 shrink-0" />
                <div className="space-y-1">
                  <p>Community tool. Not affiliated with Corvus Belli.</p>
                  <p>Version: Infinity N5 frontend companion.</p>
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
