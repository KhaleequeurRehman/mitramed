import { getQuotations } from "@/lib/actions/quotations"
import { QuotationsPagination } from "./quotations-pagination"

export async function QuotationsPaginationWrapper({ searchParams }) {
  try {
    // Handle searchParams properly for static generation
    const resolvedParams = searchParams || {}
    
    const { totalPages } = await getQuotations(resolvedParams)
    
    // Always show pagination, even for single page
    return <QuotationsPagination totalPages={totalPages} />
  } catch (error) {
    console.error('Error in QuotationsPaginationWrapper:', error)
    // Hide pagination ONLY when there's an error
    return null
  }
}
