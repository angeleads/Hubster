import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Eye, CheckCircle, XCircle, AlertCircle, Edit, Heart } from "lucide-react"
import Link from "next/link"

export type ProjectCardProps = {
  id: string
  title: string
  description: string | null
  status: string
  timelineEstimate: string
  createdAt: string
  submittedAt?: string | null
  studentName?: string
  isAdmin?: boolean
  isDraft?: boolean
  likesCount?: number
}

export function ProjectCard({
  id,
  title,
  description,
  status,
  timelineEstimate,
  submittedAt,
  studentName,
  isAdmin = false,
  isDraft = false,
  likesCount = 0,
}: ProjectCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "submitted":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "submitted":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {isAdmin && studentName && <CardDescription className="mt-1">by {studentName}</CardDescription>}
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status)}
            <Badge className={getStatusColor(status)}>{status.replace("_", " ")}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description || "No description provided"}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{timelineEstimate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>{likesCount}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
           {submittedAt && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date(submittedAt).toLocaleDateString()}</span>
            </div>
          )}
          <div className="space-x-2">
            <Link href={`/dashboard/projects/${id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            {isDraft && (
              <Link href={`/dashboard/projects/${id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
         
        </div>
      </CardContent>
    </Card>
  )
}
