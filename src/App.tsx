import { ComponentExample } from "@/components/component-example";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="infinity-theme">
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1">
          <ComponentExample />
        </main>
        <footer className="border-t bg-muted/20 py-6 px-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground font-medium">
              Infinity N5 Comlog Utility
            </div>
            <ThemeToggle />
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;