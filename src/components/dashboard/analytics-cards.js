import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, DollarSign, TrendingUp, Clock } from "lucide-react"

export function AnalyticsCards({ data = {} }) {
  const analytics = data?.analytics || {}
  const quotations = analytics?.quotations || {}
  const financial = analytics?.financial || {}
  
  // Create cards data from analytics
  const cards = [
    {
      title: "Total Quotations",
      value: quotations?.total || 0,
      description: "Total quotations created",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Total Value", 
      value: `${financial?.totalValue || 0}`,
      description: "Total value of accepted quotations",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Average Value",
      value: `${financial?.avgQuotationValue || '0.00'}`,
      description: "Average accepted quotation value", 
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Pending Amount",
      value: `${financial?.pendingAmount || 0}`,
      description: "Amount pending collection",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards && Array.isArray(cards) && cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card?.title}
            </CardTitle>
            {card?.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card?.value}</div>
            <p className="text-xs text-muted-foreground">
              {card?.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
