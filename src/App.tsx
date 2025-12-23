import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { ArmyProvider } from "@/context/army-context";
import { GameProvider } from "@/context/game-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import ArmyListsPage from "@/pages/army-lists";
import GameSequencePage from "@/pages/game-sequence";
import OrderReferencePage from "@/pages/order-reference";

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
                  <Route path="game-sequence" element={<GameSequencePage />} />
                  <Route path="order-reference" element={<OrderReferencePage />} />
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
