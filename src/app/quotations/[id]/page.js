import { Suspense } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { QuotationView } from "@/components/quotations/quotation-view"
import { QuotationViewLoading } from "@/components/quotations/quotation-view-loading"

export default async function QuotationDetailPage({ params }) {
  const { id } = await params;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <Suspense fallback={<QuotationViewLoading />}>
          <QuotationView quotationId={id} />
        </Suspense>
      </div>
    </MainLayout>
  )
}
