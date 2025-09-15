import { MainLayout } from "@/components/layout/main-layout"
import { AnalyticsCards } from "@/components/dashboard/analytics-cards"
import { StatusBreakdown } from "@/components/dashboard/status-breakdown"
import { RecentQuotations } from "@/components/dashboard/recent-quotations"

async function getDashboardData() {
  try {
    // Use internal API call for server-side rendering
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/analytics`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
    
  } catch (error) {
    throw error
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Mitramed Business Management System
          </p>
        </div>
        
        {/* Analytics Cards */}
        <AnalyticsCards data={data} />
        
        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Breakdown */}
          <StatusBreakdown data={data} />
          
          {/* Recent Quotations */}
          <RecentQuotations data={data} />
        </div>
      </div>
    </MainLayout>
  )
}
