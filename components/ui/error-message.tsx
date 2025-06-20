"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
  variant?: "default" | "destructive"
}

export function ErrorMessage({ 
  title = "Something went wrong", 
  message, 
  onRetry,
  className,
  variant = "destructive"
}: ErrorMessageProps) {
  return (
    <div className={cn("flex items-center justify-center min-h-[200px] p-4", className)}>
      <Card className={cn(
        "w-full max-w-md",
        variant === "destructive" && "border-red-200 bg-red-50"
      )}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className={cn(
              "mx-auto w-12 h-12 rounded-full flex items-center justify-center",
              variant === "destructive" ? "bg-red-100" : "bg-gray-100"
            )}>
              <AlertTriangle className={cn(
                "h-6 w-6",
                variant === "destructive" ? "text-red-600" : "text-gray-600"
              )} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
            
            {onRetry && (
              <Button 
                onClick={onRetry} 
                variant="outline" 
                className="mt-4"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}