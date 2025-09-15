"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function QuotationsHeader() {
  return (
    <div className="space-y-4">
      {/* Mobile: Stacked Layout */}
      <div className="md:hidden space-y-4">
        {/* Title & Subtitle - Centered */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Manage and track all your quotations
          </p>
        </div>
        
        {/* Button - Full Width */}
        <div className="w-full">
          <Link href="/quotations/create" className="block w-full">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Quotation
            </Button>
          </Link>
        </div>
      </div>

      {/* Desktop: Single Line Layout */}
      <div className="hidden md:flex items-center justify-between">
        {/* Title & Subtitle - Left Side */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Manage and track all your quotations
          </p>
        </div>
        
        {/* Button - Right Side */}
        <div>
          <Link href="/quotations/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Quotation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
