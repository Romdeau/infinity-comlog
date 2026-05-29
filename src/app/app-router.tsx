import { HashRouter, Navigate, Route, Routes } from "react-router-dom"

import { DashboardLayout } from "@/components/dashboard-layout"
import { appRoutes, defaultRoutePath } from "./routes"

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to={defaultRoutePath.slice(1)} replace />} />
          {appRoutes.map((route) => {
            const Page = route.component
            return <Route key={route.id} path={route.routePath} element={<Page />} />
          })}
          <Route path="*" element={<Navigate to={defaultRoutePath.slice(1)} replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
