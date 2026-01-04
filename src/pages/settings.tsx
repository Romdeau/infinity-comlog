import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon, Database, RefreshCcw, CheckCircle2, Loader2, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useArmy } from "@/context/army-context"
import { useSettings } from "@/context/settings-context"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { reimportAllLists } = useArmy()
  const { settings, updateSettings } = useSettings()
  const [reimporting, setReimporting] = React.useState(false)
  const [lastSuccess, setLastSuccess] = React.useState<number | null>(null)

  const handleReimport = async () => {
    setReimporting(true)
    setLastSuccess(null)
    try {
      await reimportAllLists()
      setLastSuccess(Date.now())
    } finally {
      setReimporting(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2.5 rounded-lg">
          <SettingsIcon className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage application preferences and data.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* User Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Ruler className="size-5 text-primary/80" />
              <CardTitle className="text-lg">Preferences</CardTitle>
            </div>
            <CardDescription>Customize your application experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="space-y-1">
                <div className="text-sm font-bold">Measurement Unit</div>
                <p className="text-xs text-muted-foreground">
                  Choose between Imperial (inches) and Metric (cm) for distances.
                </p>
              </div>
              <div className="flex bg-background border rounded-md p-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-xs font-bold",
                    settings.measurementUnit === "imperial" && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )}
                  onClick={() => updateSettings({ measurementUnit: "imperial" })}
                >
                  Imperial (")
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-xs font-bold",
                    settings.measurementUnit === "metric" && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )}
                  onClick={() => updateSettings({ measurementUnit: "metric" })}
                >
                  Metric (cm)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="size-5 text-primary/80" />
              <CardTitle className="text-lg">Data Management</CardTitle>
            </div>
            <CardDescription>Control your local data and army lists.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="space-y-1">
                <div className="text-sm font-bold flex items-center gap-2">
                  Re-import All Lists
                  {lastSuccess && (
                    <span className="text-[10px] text-green-500 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                      <CheckCircle2 className="size-3" />
                      Updated just now
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Refreshes all stored army lists using their original base64 codes. Useful after application updates.
                </p>
              </div>
              <Button 
                onClick={handleReimport} 
                disabled={reimporting}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                {reimporting ? (
                  <>
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                    Re-importing...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="mr-2 size-3.5" />
                    Re-import All
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
