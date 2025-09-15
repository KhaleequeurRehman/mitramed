"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, ArrowUp, ArrowDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function QuotationsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "ALL")
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "")
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "created_desc")

  const updateFilters = () => {
    const params = new URLSearchParams()
    
    if (search) params.set("search", search)
    if (status && status !== "ALL") params.set("status", status)
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    if (sortBy) params.set("sortBy", sortBy)
    
    params.set("page", "1")
    router.push(`/quotations?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearch("")
    router.push("/quotations")
  }

  const clearStatus = () => {
    setStatus("ALL")
    router.push("/quotations")
  }

  const clearSort = () => {
    setSortBy("created_desc")
    router.push("/quotations")
  }

  const clearDateFrom = () => {
    setDateFrom("")
    router.push("/quotations")
  }

  const clearDateTo = () => {
    setDateTo("")
    router.push("/quotations")
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters()
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [search])

  useEffect(() => {
    updateFilters()
  }, [status, dateFrom, dateTo, sortBy])

  return (
    <Card className="border-0 shadow-sm bg-card/50">
      <CardContent className="p-4 sm:p-6">
        {/* Mobile: Stacked, Desktop: Single Line */}
        <div className="space-y-4 lg:space-y-0 lg:flex lg:flex-row lg:gap-4 lg:items-end">
          {/* Search - Larger Size */}
          <div className="w-full lg:flex-1 lg:min-w-0">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quotations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10 h-12 w-full border-0 bg-background shadow-sm focus:ring-2 focus:ring-primary/20"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Filters Row - Mobile: Stacked, Desktop: Side by Side */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {/* Status - Smaller Size */}
            <div className="w-full">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
              <div className="relative">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-9 w-full border-0 bg-background shadow-sm focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SENT">Sent</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                {status !== "ALL" && (
                  <button
                    onClick={clearStatus}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort - Smaller Size */}
            <div className="w-full">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Sort</label>
              <div className="relative">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-full border-0 bg-background shadow-sm focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_desc">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-3 w-3" />
                        <span>Newest</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="created_asc">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-3 w-3" />
                        <span>Oldest</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="total_desc">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-3 w-3" />
                        <span>Price High to Low</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="total_asc">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-3 w-3" />
                        <span>Price Low to High</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {sortBy !== "created_desc" && (
                  <button
                    onClick={clearSort}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Date From */}
            <div className="w-full">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">From</label>
              <div className="relative">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-9 pr-8 w-full border-0 bg-background shadow-sm focus:ring-2 focus:ring-primary/20"
                />
                {dateFrom && (
                  <button
                    onClick={clearDateFrom}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Date To */}
            <div className="w-full">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">To</label>
              <div className="relative">
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-9 pr-8 w-full border-0 bg-background shadow-sm focus:ring-2 focus:ring-primary/20"
                />
                {dateTo && (
                  <button
                    onClick={clearDateTo}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
