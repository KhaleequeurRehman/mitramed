import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"

export function QuotationsEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-muted p-3">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No quotations found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Get started by creating your first quotation. You can create quotations for your customers and track their status.
            </p>
          </div>
          <Link href="/quotations/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Quotation
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
