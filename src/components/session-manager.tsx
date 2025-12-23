import * as React from "react"
import { useGame } from "@/context/game-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  PlusIcon,
  HistoryIcon,
  MoreVerticalIcon,
  Trash2Icon,
  CheckIcon,
  SaveIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

export function SessionManager() {
  const { sessions, activeSessionId, createSession, switchSession, deleteSession, renameSession, activeSession } = useGame()
  const [isCreating, setIsCreating] = React.useState(false)
  const [newName, setNewName] = React.useState("")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [tempName, setTempName] = React.useState("")

  const handleCreate = () => {
    if (newName.trim()) {
      createSession(newName.trim())
      setNewName("")
      setIsCreating(false)
    }
  }

  const handleRename = (id: string) => {
    if (tempName.trim()) {
      renameSession(id, tempName.trim())
      setEditingId(null)
    }
  }

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id)
    setTempName(currentName)
  }

  const sortedSessions = Object.values(sessions).sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <Card className="w-full mb-4">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <HistoryIcon className="size-4 text-primary" />
            Game Sessions
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {activeSession && editingId !== activeSessionId ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground truncate max-w-[150px]">
                {activeSession.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => startEditing(activeSessionId!, activeSession.name)}
              >
                <SaveIcon className="size-3 opacity-50" />
              </Button>
            </div>
          ) : activeSession && editingId === activeSessionId ? (
            <div className="flex items-center gap-1">
              <Input
                className="h-7 text-xs w-[150px]"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRename(activeSessionId!)}
                autoFocus
              />
              <Button variant="ghost" size="icon" className="size-7" onClick={() => handleRename(activeSessionId!)}>
                <CheckIcon className="size-3 text-green-500" />
              </Button>
            </div>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                <HistoryIcon className="size-3" />
                Switch
                <MoreVerticalIcon className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="flex items-center justify-between">
                Recent Sessions
                <Button variant="ghost" size="icon" className="size-5" onClick={() => setIsCreating(true)}>
                  <PlusIcon className="size-3" />
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortedSessions.length === 0 && (
                <div className="p-2 text-xs text-muted-foreground text-center italic">No sessions found</div>
              )}
              {sortedSessions.map((s) => (
                <div key={s.id} className="flex items-center px-2 py-1.5 hover:bg-muted/50 rounded-sm group">
                  <button
                    onClick={() => switchSession(s.id)}
                    className={cn(
                      "flex-1 text-left text-sm truncate mr-2",
                      s.id === activeSessionId && "font-bold text-primary"
                    )}
                  >
                    {s.name}
                  </button>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => startEditing(s.id, s.name)}
                    >
                      <SaveIcon className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-destructive"
                      onClick={() => deleteSession(s.id)}
                    >
                      <Trash2Icon className="size-3" />
                    </Button>
                  </div>
                  {s.id === activeSessionId && <CheckIcon className="size-3 ml-1 text-primary" />}
                </div>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCreating(true)} className="text-primary">
                <PlusIcon className="size-3 mr-2" />
                New Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {isCreating && (
        <CardContent className="px-4 pb-3 pt-0">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Session Name (e.g. Game 1 vs John)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-8 text-xs"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button size="sm" className="h-8 text-xs" onClick={handleCreate}>Create</Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setIsCreating(false)}>Cancel</Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
