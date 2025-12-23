import { ArmyManager } from "@/components/army-manager"

export default function ArmyListsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="col-span-2">
          <ArmyManager />
        </div>
      </div>
    </div>
  )
}
