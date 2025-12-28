import { useArmy } from "@/context/army-context"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GlobalNotifications() {
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
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Import Warning</div>
          <div className="text-[11px] leading-relaxed pr-6 font-medium">
            {error}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 size-6 hover:bg-white/20 text-white"
            onClick={clearImportErrors}
          >
            <X className="size-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}
