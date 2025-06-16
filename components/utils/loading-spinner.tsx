import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ message = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center">
        <Loader2 className={`animate-spin ${sizeClasses[size]} text-purple-500 mb-3`} />
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  )
}
