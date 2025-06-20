"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  className?: string
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn("flex items-center justify-center min-h-[300px] p-4", className)}>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {icon && (
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                {icon}
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">{description}</p>
            </div>
            
            {action && (
              <Button 
                onClick={action.onClick}
                variant={action.variant || "default"}
                className="mt-4"
              >
                {action.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}