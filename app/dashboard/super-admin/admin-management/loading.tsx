import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AdminManagementLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingSpinner message="Loading admin management..." />
    </div>
  )
}
