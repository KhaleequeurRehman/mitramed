"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export function QuotationsPagination({ totalPages }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentPage = parseInt(searchParams.get("page") || "1")
  const currentLimit = parseInt(searchParams.get("limit") || "10")

  const updatePage = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`/quotations?${params.toString()}`)
  }

  const updateLimit = (limit) => {
    const params = new URLSearchParams(searchParams)
    params.set("limit", limit.toString())
    params.set("page", "1") // Reset to first page when changing limit
    router.push(`/quotations?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="space-y-3">
      {/* Desktop: Single Line Layout - Reversed Order */}
      <div className="hidden md:flex items-center justify-between">
        {/* Rows Per Page - Left Side */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={currentLimit.toString()} onValueChange={(value) => updateLimit(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pagination Controls - Right Side */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          
          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === "number" && updatePage(page)}
              disabled={page === "..."}
              className={page === "..." ? "cursor-default h-8 w-8 p-0" : "h-8 w-8 p-0"}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Mobile: Stacked Layout - Same as Before */}
      <div className="md:hidden space-y-3">
        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          
          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === "number" && updatePage(page)}
              disabled={page === "..."}
              className={page === "..." ? "cursor-default h-8 w-8 p-0" : "h-8 w-8 p-0"}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-3 w-3" />
          </Button>
        </div>

        {/* Rows Per Page */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={currentLimit.toString()} onValueChange={(value) => updateLimit(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
