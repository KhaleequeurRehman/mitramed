import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function QuotationViewLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      <Card className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <Skeleton className="h-16 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          
          {/* Items Table */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-6 gap-4">
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Total */}
          <div className="flex justify-end">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </Card>
    </div>
  )
}
