import { InfinityGameFlow } from "@/components/infinity-game-flow"
import { PageIntro } from "@/components/page-intro"
import { SessionManager } from "@/components/session-manager"
import { useArmy } from "@/context/army-context"

export default function GameSequencePage() {
  const { lists } = useArmy()

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageIntro
        eyebrow="Live Session"
        title="Track Game Flow"
        description="Manage session state, follow the setup sequence, and keep turn progress visible while you play."
      />
      <div className="mx-auto w-full max-w-3xl">
        <SessionManager />
        <InfinityGameFlow armyLists={lists} />
      </div>
    </div>
  )
}
