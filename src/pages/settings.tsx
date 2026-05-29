import * as React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PageHeader, Panel } from "@/components/system"
import { AppearancePanel } from "@/components/appearance-panel"
import { useArmy } from "@/context/army-context"
import { useSettings } from "@/context/settings-context"
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Loader2,
  Palette,
  RefreshCcw,
  Ruler,
} from "lucide-react"

function PanelIcon({ icon: Icon }: { icon: typeof Ruler }) {
  return (
    <div className="rounded-lg bg-primary/10 p-2 text-primary">
      <Icon className="size-4" />
    </div>
  )
}

export default function SettingsPage() {
  const { reimportAllLists } = useArmy()
  const { settings, updateSettings } = useSettings()
  const [reimporting, setReimporting] = React.useState(false)
  const [lastSuccess, setLastSuccess] = React.useState<number | null>(null)
  const [reimportError, setReimportError] = React.useState<string | null>(null)

  const handleReimport = async () => {
    setReimporting(true)
    setLastSuccess(null)
    setReimportError(null)

    try {
      await reimportAllLists()
      setLastSuccess(Date.now())
    } catch (error) {
      setReimportError(
        error instanceof Error
          ? error.message
          : "An unknown error prevented re-importing your stored lists."
      )
    } finally {
      setReimporting(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="System Configuration"
        title="Settings"
        description="Configure appearance, the measurement system you want to use, and manage the locally stored list data that powers the rest of the workspace."
      />

      <Panel
        title="Appearance"
        eyebrow="Interface"
        actions={<PanelIcon icon={Palette} />}
      >
        <AppearancePanel />
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Panel title="Display" eyebrow="Units" actions={<PanelIcon icon={Ruler} />}>
          <p className="-mt-2 mb-4 text-sm text-muted-foreground">
            Customize how the app presents distances and reference values throughout the interface.
          </p>
          <section className="space-y-4 rounded-lg border border-border/70 bg-muted/15 p-4">
            <div className="space-y-1">
              <h2 className="text-sm font-medium text-foreground">Measurement Unit</h2>
              <p className="text-sm text-muted-foreground">
                Choose between Imperial (inches) and Metric (cm) for distances shown across the app.
              </p>
            </div>

            <RadioGroup
              value={settings.measurementUnit}
              onValueChange={(value) =>
                updateSettings({ measurementUnit: value as "imperial" | "metric" })
              }
              className="grid gap-3 sm:grid-cols-2"
            >
              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/70 bg-background px-4 py-3 hover:border-primary/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value="imperial" id="unit-imperial" className="mt-1" />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-foreground">Imperial</div>
                  <div className="text-sm text-muted-foreground">
                    Uses inches for movement, range, and reference values.
                  </div>
                </div>
              </Label>
              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/70 bg-background px-4 py-3 hover:border-primary/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value="metric" id="unit-metric" className="mt-1" />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-foreground">Metric</div>
                  <div className="text-sm text-muted-foreground">
                    Uses centimeters for movement, range, and reference values.
                  </div>
                </div>
              </Label>
            </RadioGroup>
          </section>
        </Panel>

        <Panel title="Data" eyebrow="Storage" actions={<PanelIcon icon={Database} />}>
          <p className="-mt-2 mb-4 text-sm text-muted-foreground">
            Maintain the stored list data used throughout the application.
          </p>
          <section className="space-y-4 rounded-lg border border-border/70 bg-muted/15 p-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-medium text-foreground">Re-import All Lists</h2>
                {lastSuccess && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-status-complete">
                    <CheckCircle2 className="size-3.5" />
                    Updated just now
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Refreshes all stored army lists using their original base64 codes. Run this after
                data or parsing changes when you want stored lists to pick up the latest enrichments.
              </p>
            </div>

            <Alert>
              <AlertCircle />
              <AlertTitle>Local data refresh</AlertTitle>
              <AlertDescription>
                This only updates lists stored in your browser. It will not delete them, but it may
                change derived values if the underlying data has changed.
              </AlertDescription>
            </Alert>

            {reimportError && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Re-import failed</AlertTitle>
                <AlertDescription>{reimportError}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Use this when metadata changes or when you want older saved lists to refresh against
                the current parser and faction data.
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
          </section>
        </Panel>
      </div>
    </div>
  )
}
