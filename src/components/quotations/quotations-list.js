import { QuotationsTable } from "./quotations-table"
import { QuotationsEmptyState } from "./quotations-empty-state"
import { getQuotations } from "@/lib/actions/quotations"
import { Card, CardContent } from "@/components/ui/card"

// This is a server component that fetches data at request time
export async function QuotationsList({ searchParams }) {
  try {
    // Handle searchParams properly for static generation
    const resolvedParams = searchParams || {}
    
    const { quotations, total, totalPages } = await getQuotations(resolvedParams)

    if (!quotations || quotations.length === 0) {
      return <QuotationsEmptyState />
    }

    return (
      <div className="space-y-4">
        <QuotationsTable quotations={quotations} />
      </div>
    )
  } catch (error) {
    console.error('Error in QuotationsList:', error)
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <span className="text-destructive text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Failed to load quotations
              </h3>
              <p className="text-muted-foreground">
                There was an error loading your quotations. Please check your connection and try again.
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Please refresh the page to try again.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
}
