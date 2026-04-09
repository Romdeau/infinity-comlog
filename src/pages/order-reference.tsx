import { PageIntro } from "@/components/page-intro"
import { TurnReference } from "@/components/turn-reference"

export default function OrderReferencePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageIntro
        eyebrow="Reference"
        title="Keep The Turn Sequence Close"
        description="Use a compact rules companion for common actions, AROs, and quick links to the Infinity wiki during play."
      />
      <TurnReference />
    </div>
  )
}
