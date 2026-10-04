import { ArmyManager } from "@/components/army-manager"
import { PageHeader } from "@/components/system"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function ArmyListsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        eyebrow="List Workspace"
        title="Prepare Your Active Lists"
        description="Build or import a roster, keep two active lists ready for comparison, and maintain a reusable local library for future games."
        actions={<Button asChild><Link to="/army-builder">Build an army</Link></Button>}
      />
      <ArmyManager />
    </div>
  )
}
