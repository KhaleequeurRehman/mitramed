import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { ArrowRight, Calendar, FileText } from "lucide-react"
import Link from "next/link"

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
      case 'ACCEPTED': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
      case 'EXPIRED': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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
                      {quotation?.vendorName || 'Unknown Vendor'}
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
                    <span>¥{quotation?.total?.toLocaleString() || 0}</span>
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

