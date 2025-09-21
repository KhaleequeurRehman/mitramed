import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { ArrowRight, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { formatDate, getStatusColor } from "@/lib/utils"

export function RecentQuotations({ data = {} }) {
  if (!data || !data.analytics || !data.analytics.recentQuotations || data.analytics.recentQuotations.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Quotations</CardTitle>
          <Link href="/quotations">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <EmptyState 
            icon={FileText}
            title="No Recent Quotations"
            description="No quotations have been created yet."
          />
        </CardContent>
      </Card>
    )
  }

  const { recentQuotations } = data.analytics || {}

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Quotations</CardTitle>
        <Link href="/quotations">
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentQuotations && Array.isArray(recentQuotations) && recentQuotations.slice(0, 5).map((quotation) => (
            <div key={quotation?.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <p className="font-medium">{quotation?.customerName || 'Unknown Customer'}</p>
                    <p className="text-sm text-muted-foreground">
                      {quotation?.number || 'N/A'}
                    </p>
                  </div>
                  <Badge className={getStatusColor(quotation?.status)}>
                    {quotation?.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(quotation?.created)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{quotation?.total?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
              <Link href={`/quotations/${quotation?.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

