import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ArmyProvider } from "@/context/army-context";
import { GameProvider } from "@/context/game-context";
import { DashboardLayout } from "@/components/dashboard-layout";

const ArmyListsPage = lazy(() => import("@/pages/army-lists"));
const ArmyListViewPage = lazy(() => import("@/pages/army-list-view"));
const ListAnalysisPage = lazy(() => import("@/pages/list-analysis"));
const GameSequencePage = lazy(() => import("@/pages/game-sequence"));
const OrderReferencePage = lazy(() => import("@/pages/order-reference"));
const SettingsPage = lazy(() => import("@/pages/settings"));

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="infinity-theme">
      <ArmyProvider>
        <GameProvider>
          <div className="min-h-screen bg-background text-foreground">
            <HashRouter>
              <Routes>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="army-lists" replace />} />
                  <Route path="army-lists" element={<ArmyListsPage />} />
                  <Route path="army-list-view" element={<ArmyListViewPage />} />
                  <Route path="list-analysis" element={<ListAnalysisPage />} />
                  <Route path="game-sequence" element={<GameSequencePage />} />
                  <Route path="order-reference" element={<OrderReferencePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="army-lists" replace />} />
                </Route>
              </Routes>
            </HashRouter>
          </div>
        </GameProvider>
      </ArmyProvider>
    </ThemeProvider>
  );
}

export default App;
