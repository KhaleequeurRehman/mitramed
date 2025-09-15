"use client"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

export function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        {/* Page Content - Mobile Responsive Padding */}
        <main className="container mx-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
