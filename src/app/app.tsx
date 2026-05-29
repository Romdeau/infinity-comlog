import { AppProviders } from "./app-providers"
import { AppRouter } from "./app-router"

export function App() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-background text-foreground antialiased">
        <AppRouter />
      </div>
    </AppProviders>
  )
}

export default App
