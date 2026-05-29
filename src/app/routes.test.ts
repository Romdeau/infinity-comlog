import { describe, expect, it } from "vitest"

import { appRoutes, defaultRoutePath, getRouteMeta } from "./routes"
import { navGroups, settingsNavItem } from "./navigation"

describe("app route registry", () => {
  it("uses the registry as the source for route metadata", () => {
    const listView = appRoutes.find((route) => route.id === "army-list-view")

    expect(listView).toBeDefined()
    expect(getRouteMeta("/army-list-view")).toMatchObject({
      title: listView?.title,
      section: listView?.section,
      description: listView?.description,
      status: listView?.status,
    })
  })

  it("derives sidebar and settings navigation from registered routes", () => {
    const sidebarUrls = navGroups.flatMap((group) => group.items.map((item) => item.url))

    expect(sidebarUrls).toEqual(["/army-lists", "/army-list-view", "/list-analysis", "/game-sequence", "/order-reference"])
    expect(settingsNavItem.url).toBe("/settings")
    expect(defaultRoutePath).toBe("/army-lists")
  })
})
