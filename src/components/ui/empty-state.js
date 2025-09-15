import { Card, CardContent } from "@/components/ui/card"

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {Icon && <Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
        {action && action}
      </CardContent>
    </Card>
  )
}
