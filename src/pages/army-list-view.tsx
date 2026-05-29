import { useArmy } from "@/context/army-context"
import { useSettings } from "@/context/settings-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PrinterIcon } from "lucide-react"
import { PageEmptyState } from "@/components/page-empty-state"
import { PageHeader } from "@/components/system"
import { ListView, PrintStyles } from "@/components/list-view"
import { usePrint } from "@/shared/hooks/use-print"

export default function ArmyListViewPage() {
  const { lists } = useArmy()
  const { settings } = useSettings()
  const handlePrint = usePrint()

  if (!lists.listA && !lists.listB) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <PageHeader
          eyebrow="Roster Viewer"
          title="Inspect Active Lists"
          description="Open a cleaner read-only view of each list, print roster details, and scan combat groups or weapon profiles more easily."
          status="Alpha"
        />
        <PageEmptyState
          title="No Army Lists Loaded"
          description="Please import an army list in the Army Lists page first."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        eyebrow="Roster Readout"
        title="Inspect Active Lists"
        description="Review combat groups, unit details, and weapon profiles in a format that is easier to scan at the table or print before a round."
        status="Alpha"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="print:hidden"
          >
            <PrinterIcon className="mr-2 size-4" />
            Print List
          </Button>
        }
      />

      <Tabs defaultValue="listA" className="w-full">
        <TabsList className="grid w-full grid-cols-2 print:hidden">
          <TabsTrigger value="listA" disabled={!lists.listA}>
            {lists.listA?.armyName || "List A"}
          </TabsTrigger>
          <TabsTrigger value="listB" disabled={!lists.listB}>
            {lists.listB?.armyName || "List B"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="listA" className="mt-4 print:mt-0">
          {lists.listA && <ListView list={lists.listA} unit={settings.measurementUnit} />}
        </TabsContent>
        <TabsContent value="listB" className="mt-4 print:mt-0">
          {lists.listB && <ListView list={lists.listB} unit={settings.measurementUnit} />}
        </TabsContent>
      </Tabs>

      <PrintStyles />
    </div>
  )
}
