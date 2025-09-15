import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function QuotationsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="border-b">
            <div className="grid grid-cols-7 gap-4 p-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b last:border-b-0">
              <div className="grid grid-cols-7 gap-4 p-4">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  )
}
