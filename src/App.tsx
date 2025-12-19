import * as React from "react";
import { GameTracker } from "@/components/game-tracker";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArmyManager } from "@/components/army-manager";
import { type ArmyList } from "@/lib/army-parser";
import { AppLayout } from "@/components/layout-containers";

export function App() {
  const [lists, setLists] = React.useState<{ listA: ArmyList | null; listB: ArmyList | null }>({
    listA: null,
    listB: null
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="infinity-theme">
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1">
          <AppLayout>
            <ArmyManager onListsChanged={setLists} />
            <GameTracker armyLists={lists} />
          </AppLayout>
        </main>
        <footer className="border-t bg-muted/20 py-6 px-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground font-medium">
              <div>Infinity N5 Comlog Utility</div>
              <div className="text-xs opacity-70 font-normal mt-1 italic">
                Note: This is a community-made tool and is not affiliated with Corvus Belli.
              </div>
            </div>
            <ThemeToggle />
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;