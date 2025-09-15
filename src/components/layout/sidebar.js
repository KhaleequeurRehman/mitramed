"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, List, BarChart3 } from "lucide-react"

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: BarChart3
  },
  {
    title: "All Quotations",
    href: "/quotations",
    icon: List
  },
  {
    title: "Create Quotation",
    href: "/quotations/create",
    icon: Plus
  }
]

export function Sidebar({ className, isOpen = false }) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r transition-transform duration-200 ease-in-out md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full",
      className
    )}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 md:h-20 items-center justify-center border-b px-4">
          <Link className="flex items-center" href="/">
            <span className="text-xl md:text-2xl lg:text-3xl font-bold">
              Mitramed
            </span>
          </Link>
        </div>
        
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item?.href
              
              return (
                <Button
                  key={item?.href}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  asChild
                >
                  <Link href={item?.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item?.title}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}
