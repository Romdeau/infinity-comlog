import { useArmy } from "@/context/army-context"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ArmyImportNotifications() {
  const { importErrors, clearImportErrors } = useArmy()

  if (importErrors.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm space-y-2 animate-in slide-in-from-bottom-5">
      {importErrors.map((error, idx) => (
        <div
          key={idx}
          className="relative p-3 pl-10 bg-destructive text-destructive-foreground rounded-md shadow-lg border border-destructive-foreground/10"
        >
          <AlertCircle className="absolute left-3 top-3.5 size-4" />
          <div className="mb-0.5 text-xs font-medium uppercase tracking-[0.14em] opacity-80">Import Warning</div>
          <div className="pr-6 text-sm leading-relaxed font-medium">
            {error}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 size-6 text-destructive-foreground hover:bg-destructive-foreground/20"
            onClick={clearImportErrors}
          >
            <X className="size-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}
