import { Suspense } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { QuotationsList } from "@/components/quotations/quotations-list"
import { QuotationsHeader } from "@/components/quotations/quotations-header"
import { QuotationsFilters } from "@/components/quotations/quotations-filters"
import { QuotationsPaginationWrapper } from "@/components/quotations/quotations-pagination-wrapper"
import { QuotationsLoading } from "@/components/quotations/quotations-loading"

// This makes the page a server component that can access searchParams
export default async function QuotationsPage({ searchParams }) {
  return (
    <MainLayout>
      <div className="space-y-6">
        <QuotationsHeader />
        <QuotationsFilters />
        <Suspense fallback={<QuotationsLoading />}>
          <QuotationsList searchParams={searchParams} />
        </Suspense>
        <Suspense>
          <QuotationsPaginationWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </MainLayout>
  )
}
