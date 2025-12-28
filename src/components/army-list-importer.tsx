import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArmyParser, type ArmyList } from "@/lib/army-parser"
import { FileCode, AlertCircle } from "lucide-react"

export function ArmyListImporter({ onListParsed }: { onListParsed?: (list: ArmyList | null, rawCode: string) => void }) {
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const handleParse = () => {
    setError(null)
    if (!code.trim()) return

    try {
      const cleanCode = code.replace(/\s/g, "")
      const parser = new ArmyParser(cleanCode)
      const list = parser.parse()
      if (onListParsed) onListParsed(list, cleanCode)
    } catch (e) {
      setError("Failed to parse army code. Please check the code and try again.")
      console.error(e)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="army-code" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-70">
          Paste Army Code (Base64)
        </Label>
        <Textarea
          id="army-code"
          placeholder="e.g. hE4Mc2hpbmRl..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="min-h-[100px] text-[10px] font-mono resize-none leading-relaxed bg-muted/20 border-border/50 focus:border-primary/50"
        />
        <Button
          onClick={handleParse}
          size="sm"
          className="w-full text-xs font-bold h-9 shadow-sm"
          disabled={!code.trim()}
        >
          <FileCode className="mr-2 size-3.5" />
          Parse & Import List
        </Button>
      </div>

      {error && (
        <div className="text-[11px] text-destructive flex items-start gap-2 p-2.5 bg-destructive/10 rounded-md animate-in shake-1 duration-300">
          <AlertCircle className="size-4 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="rounded-md bg-primary/5 border border-primary/10 p-3 italic text-[11px] text-muted-foreground flex gap-3">
        <div className="bg-primary/10 p-1.5 rounded h-fit">
          <AlertCircle className="size-3 text-primary" />
        </div>
        <span>You can get this code from the "Copy Code" button in the Infinity Army 7 app or website.</span>
      </div>
    </div>
  )
}
