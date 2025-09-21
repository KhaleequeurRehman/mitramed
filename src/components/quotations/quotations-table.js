import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { QuotationActions } from "./quotation-actions"

const statusLabels = {
  DRAFT: "Draft",
  SENT: "Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected"
}

export function QuotationsTable({ quotations }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotations</CardTitle>
        <CardDescription>
          A list of all quotations in your system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Horizontal Scrollable Table for All Devices */}
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Quotation #</TableHead>
                <TableHead className="whitespace-nowrap">Customer</TableHead>
                <TableHead className="whitespace-nowrap">Vendor</TableHead>
                <TableHead className="whitespace-nowrap">Total</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">Created</TableHead>
                <TableHead className="w-[80px] whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {quotation.number || "N/A"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div>
                      <div className="font-medium">
                        {quotation.customer?.name || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {quotation.customer?.email || "N/A"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div>
                      <div className="font-medium">
                        {quotation.items && quotation.items.length > 0 
                          ? quotation.items[0]?.vendor?.name || "N/A"
                          : "N/A"
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {quotation.items && quotation.items.length > 0 
                          ? quotation.items[0]?.vendor?.email || "N/A"
                          : "N/A"
                        }
                      </div>
                      {(() => {
                        if (!quotation.items || quotation.items.length <= 1) return null;
                        
                        // Get all unique vendor names
                        const allVendors = [...new Set(quotation.items
                          .map(item => item?.vendor?.name)
                          .filter(name => name)
                        )];
                        
                        // If there are different vendors (more than 1 unique vendor)
                        if (allVendors.length > 1) {
                          const otherVendors = allVendors.filter(name => name !== quotation.items[0]?.vendor?.name);
                          return (
                            <div className="text-xs text-muted-foreground">
                              +{otherVendors.length} more vendor{otherVendors.length > 1 ? 's' : ''}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {formatCurrency(quotation.total)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge className={getStatusColor(quotation.status)}>{statusLabels[quotation.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {formatDate(quotation.created)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <QuotationActions quotation={quotation} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
