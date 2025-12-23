import { InfinityGameFlow } from "@/components/infinity-game-flow"
import { SessionManager } from "@/components/session-manager"
import { useArmy } from "@/context/army-context"

export default function GameSequencePage() {
  const { lists } = useArmy()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="mx-auto w-full max-w-3xl">
        <SessionManager />
        <InfinityGameFlow armyLists={lists} />
      </div>
    </div>
  )
}
