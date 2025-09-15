import { MainLayout } from "@/components/layout/main-layout"
import { AnalyticsCards } from "@/components/dashboard/analytics-cards"
import { StatusBreakdown } from "@/components/dashboard/status-breakdown"
import { RecentQuotations } from "@/components/dashboard/recent-quotations"

async function getDashboardData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics`, {
      cache: 'no-store'
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
  let data
  
  try {
    data = await getDashboardData()
    
    // Check if API returned error
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch dashboard data')
    }
  } catch (error) {
    // This will trigger error.js
    throw error
  }

  console.log('analytics data', data)
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
