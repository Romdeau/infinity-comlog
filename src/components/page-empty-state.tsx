import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PageEmptyStateProps = {
  title: string
  description: string
}

export function PageEmptyState({ title, description }: PageEmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <Card className="w-full max-w-xl border-dashed bg-card/50">
        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">{description}</CardContent>
      </Card>
    </div>
  )
}
