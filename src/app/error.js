"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function DashboardError({ error, reset }) {
  console.log("Failed to fetch dashboard data:", error?.message || error)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to MitraMed Business Management System
          </p>
        </div>
        
        {/* Error State */}
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-red-800 dark:text-red-200">
              Failed to Load Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-600 dark:text-red-300 mb-4">
              {error?.message || "Something went wrong while loading the dashboard"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset} className="bg-red-600 hover:bg-red-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" asChild>
                <a href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Error Details for Debugging */}
        <Card>
          <CardHeader>
            <CardTitle>Error Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Error Message:</strong> {error?.message || 'Unknown error'}</p>
              <p><strong>Error Type:</strong> {error?.name || 'Error'}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
              <p className="text-muted-foreground">
                If this error persists, please check your internet connection or contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
