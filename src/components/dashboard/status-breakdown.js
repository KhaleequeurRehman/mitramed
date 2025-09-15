import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EmptyState } from "@/components/ui/empty-state"
import { BarChart3 } from "lucide-react"

export function StatusBreakdown({ data = {} }) {
  if (!data || !data.analytics || !data.analytics.statusBreakdown) {
    return <EmptyState 
      icon={BarChart3}
      title="No Status Data"
      description="Status breakdown data is not available at the moment."
    />
  }

  const { statusBreakdown } = data.analytics || {}
  
  // Calculate total for percentage
  const total = statusBreakdown.reduce((sum, status) => sum + status.count, 0)
  
  // Show empty state if no quotations exist
  if (total === 0) {
    return <EmptyState 
      icon={BarChart3}
      title="No Quotations Yet"
      description="Create your first quotation to see status breakdown."
    />
  }
  
  // Add percentage to each status
  const statusWithPercentage = statusBreakdown.map(status => ({
    ...status,
    percentage: total > 0 ? Math.round((status.count / total) * 100) : 0
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {statusWithPercentage && Array.isArray(statusWithPercentage) && statusWithPercentage.map((status, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm font-medium">{status?.status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {status?.count}
                </span>
                <span className="text-sm font-medium">
                  {status?.percentage}%
                </span>
              </div>
            </div>
            <Progress value={status?.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
