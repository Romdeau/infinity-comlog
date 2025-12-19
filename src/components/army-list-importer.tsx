import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArmyParser, type ArmyList } from "@/lib/army-parser"
import { FileCode, AlertCircle, CheckCircle2 } from "lucide-react"

export function ArmyListImporter({ onListParsed }: { onListParsed?: (list: ArmyList | null) => void }) {
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [parsedList, setParsedList] = React.useState<ArmyList | null>(null)

  const handleParse = () => {
    setError(null)
    setParsedList(null)
    if (!code.trim()) return

    try {
      // Remove whitespace/newlines from input
      const cleanCode = code.replace(/\s/g, "")
      const parser = new ArmyParser(cleanCode)
      const list = parser.parse()
      setParsedList(list)
      if (onListParsed) onListParsed(list)
    } catch (e) {
      setError("Failed to parse army code. Please check the code and try again.")
      console.error(e)
    }
  }

  return (
    <div className="space-y-4 px-1">
      <div className="space-y-2">
        <Label htmlFor="army-code" className="text-xs font-semibold text-muted-foreground">Army Code (Base64)</Label>
        <div className="flex gap-2">
          <Textarea
            id="army-code"
            placeholder="Paste army code here (e.g. hE4Mc2hpbmRl...)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-[60px] text-[10px] font-mono resize-none leading-tight"
          />
        </div>
        <Button
          onClick={handleParse}
          size="sm"
          className="w-full text-xs h-7"
          disabled={!code.trim()}
        >
          <FileCode className="mr-2 size-3" />
          Parse Army Code
        </Button>
      </div>

      {error && (
        <div className="text-xs text-destructive flex items-start gap-1 p-2 bg-destructive/10 rounded-md">
          <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {parsedList && (
        <div className="rounded-md border border-border bg-muted/20 p-3 space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <CheckCircle2 className="size-4 text-green-500" />
            <div className="font-semibold text-sm">{parsedList.armyName || "Unnamed List"}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            <div>Warning: <span className="text-foreground font-medium">{parsedList.sectoralName || "Unknown"}</span></div>
            <div>Points: <span className="text-foreground font-medium">{parsedList.points}</span></div>
            <div className="col-span-2">Groups: <span className="text-foreground font-medium">{parsedList.combatGroups.length}</span></div>
          </div>

          <div className="space-y-2 pt-2">
            {parsedList.combatGroups.map(group => (
              <div key={group.groupNumber} className="bg-background/50 p-2 rounded border border-border/50">
                <div className="font-semibold mb-1 text-primary/80">Group {group.groupNumber} ({group.members.length} members)</div>
                <ul className="space-y-0.5 max-h-40 overflow-y-auto pl-1">
                  {group.members.map((m, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[9px] font-mono opacity-70">{m.groupId}</span>
                      <span>{m.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
