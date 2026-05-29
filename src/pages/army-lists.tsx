import { ArmyManager } from "@/components/army-manager"
import { PageHeader } from "@/components/system"

export default function ArmyListsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        eyebrow="List Workspace"
        title="Prepare Your Active Lists"
        description="Import a roster, keep two active lists ready for comparison, and maintain a reusable local library for future games."
      />
      <ArmyManager />
    </div>
  )
}
