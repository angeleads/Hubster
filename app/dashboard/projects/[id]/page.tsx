"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/utils/status-badge"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/utils/loading-spinner"
import { ErrorMessage } from "@/components/utils/error-message"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  Send,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react"
import Link from "next/link"

type ProjectDetails = {
  id: string
  name: string
  summary: string
  status: string
  student_id: string
  functional_purpose: string[]
  material: string | null
  programming_languages: string[]
  resources: string[]
  deliverables: any
  total_estimated_days: number
  total_xp: number
  releases: any
  screenshots: string[] | null
  description: string | null
  video_url: string | null
  project_folder_url: string | null
  admin_feedback: string | null
  presentation_date: string | null
  created_at: string
  updated_at: string
  profiles: {
    full_name: string
    email: string
    tekx_position: string | null
  } | null
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const { toast } = useToast()
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const projectId = params.id as string

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const createMissingProfile = async (userId: string) => {
    try {

      // Get the current user's auth data
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error("Error getting user data:", userError)
        throw userError
      }

      if (!userData.user) {
        throw new Error("No authenticated user found")
      }

      const email = userData.user.email || "unknown@example.com"
      const fullName =
        userData.user.user_metadata?.full_name ||
        userData.user.user_metadata?.full_name ||
        email.split("@")[0] ||
        "Unknown User"

      console.log("Creating profile with data:", {
        id: userId,
        email,
        full_name: fullName,
        role: "student",
        tekx_position: userData.user.user_metadata?.tekx_position || null,
      })

      // Try to create the profile with better error handling
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            email: email,
            full_name: fullName,
            role: "student",
            tekx_position: userData.user.user_metadata?.tekx_position || null,
          },
          {
            onConflict: "id",
          },
        )
        .select("full_name, email, tekx_position")
        .single()

      if (createError) {
        console.error("Error creating profile:", createError)
        console.error("Error details:", JSON.stringify(createError, null, 2))

        // If it's a permission error, try a different approach
        if (createError.code === "42501" || createError.message?.includes("permission")) {
          console.log("Permission denied, trying alternative approach...")

          // Return a default profile instead of failing
          return {
            full_name: fullName,
            email: email,
            tekx_position: userData.user.user_metadata?.tekx_position || null,
          }
        }

        throw createError
      }

      console.log("Successfully created profile:", newProfile)
      return newProfile
    } catch (error) {
      console.error("Error in createMissingProfile:", error)

      // Return a fallback profile instead of throwing
      return {
        full_name: "Unknown User",
        email: "unknown@example.com",
        tekx_position: null,
      }
    }
  }

  const fetchProject = async () => {
    setLoading(true)
    setError(null)

    try {

      // First, try to get the project with profile data
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          profiles:student_id (
            full_name,
            email,
            tekx_position
          )
        `)
        .eq("id", projectId)
        .single()

      if (error) {
        console.error("Error fetching project:", error)
        throw error
      }

      if (!data) {
        throw new Error("Project not found")
      }

      console.log("Project data received:", data)

      // Process the data to ensure proper structure
      const processedData = { ...data }

      // Parse releases if it's a string
      if (typeof processedData.releases === "string") {
        try {
          processedData.releases = JSON.parse(processedData.releases)
        } catch (e) {
          console.error("Error parsing releases:", e)
          processedData.releases = [
            { version: "1.0", features: [] },
            { version: "2.0", features: [] },
            { version: "3.0", features: [] },
            { version: "4.0", features: [] },
          ]
        }
      }

      // If releases is not an array, create a default structure
      if (!Array.isArray(processedData.releases)) {
        processedData.releases = [
          { version: "1.0", features: [] },
          { version: "2.0", features: [] },
          { version: "3.0", features: [] },
          { version: "4.0", features: [] },
        ]
      }

      // Parse deliverables if it's a string
      if (typeof processedData.deliverables === "string") {
        try {
          processedData.deliverables = JSON.parse(processedData.deliverables)
        } catch (e) {
          console.error("Error parsing deliverables:", e)
          processedData.deliverables = []
        }
      }

      // If deliverables is not an array, create an empty array
      if (!Array.isArray(processedData.deliverables)) {
        processedData.deliverables = []
      }

      // Handle missing profile
      if (!processedData.profiles) {
        console.log("Profile data missing for student_id:", processedData.student_id)

        // Try to create the missing profile
        const createdProfile = await createMissingProfile(processedData.student_id)
        processedData.profiles = createdProfile
      }

      setProject(processedData as ProjectDetails)
      setFeedback(processedData.admin_feedback || "")
    } catch (error: any) {
      console.error("Error in fetchProject:", error)
      setError("Failed to load project details. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!project) return
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          status: "approved",
          admin_feedback: feedback || "Project approved",
        })
        .eq("id", projectId)

      if (error) throw error

      toast({
        title: "Project Approved",
        description: "The project has been approved successfully",
      })

      // Refresh project data
      fetchProject()
    } catch (error) {
      console.error("Error approving project:", error)
      toast({
        title: "Error",
        description: "Failed to approve project",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!project || !feedback) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback before rejecting the project",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          status: "rejected",
          admin_feedback: feedback,
        })
        .eq("id", projectId)

      if (error) throw error

      toast({
        title: "Project Rejected",
        description: "The project has been rejected with feedback",
      })

      // Refresh project data
      fetchProject()
    } catch (error) {
      console.error("Error rejecting project:", error)
      toast({
        title: "Error",
        description: "Failed to reject project",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    if (!project) return
    if (project.status !== "draft") return

    setSubmitting(true)

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          status: "submitted",
        })
        .eq("id", projectId)

      if (error) throw error

      toast({
        title: "Project Submitted",
        description: "Your project has been submitted for review",
      })

      // Refresh project data
      fetchProject()
    } catch (error) {
      console.error("Error submitting project:", error)
      toast({
        title: "Error",
        description: "Failed to submit project",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading project details..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProject} />
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-black mb-2">Project Not Found</h2>
        <p className="text-slate-400 mb-6">
          The project you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link href="/dashboard">
          <Button className="hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2 hover:underline" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  const isAdmin = profile?.role === "admin"
  const isOwner = profile?.id === project.student_id
  const canEdit = isOwner && project.status === "draft"
  const canSubmit = isOwner && project.status === "draft"
  const canReview = isAdmin && project.status === "submitted"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-black flex items-center mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold text-black">{project.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={project.status} />
            <span className="text-sm text-slate-400">
              Created on {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <Button variant="outline" className="border-slate-700 text-slate-600 hover:bg-slate-800">
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            </Link>
          )}
          {canSubmit && (
            <Button onClick={handleSubmit} disabled={submitting} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4 mr-2" />
              Submit for Review
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-purple-200 border-purple-100 rounded-2xl p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-100 rounded-2xl">
            Overview
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-purple-100 rounded-2xl">
            Technical Details
          </TabsTrigger>
          <TabsTrigger value="deliverables" className="data-[state=active]:bg-purple-100 rounded-2xl">
            Deliverables
          </TabsTrigger>
          <TabsTrigger value="releases" className="data-[state=active]:bg-purple-100 rounded-2xl">
            Releases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="bg-purple-100 border-purple-100">
            <CardHeader>
              <CardTitle className="text-black">Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">{project.summary}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-purple-100 border-purple-100">
              <CardHeader>
                <CardTitle className="text-black">Project Leader</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{project.profiles?.full_name || "Unknown User"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{project.profiles?.tekx_position || "No position specified"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-100 border-purple-100">
              <CardHeader>
                <CardTitle className="text-black">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">Estimated: {project.total_estimated_days} days</span>
                </div>
                {project.presentation_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">
                      Presentation: {new Date(project.presentation_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-purple-100 border-purple-100">
            <CardHeader>
              <CardTitle className="text-black">Functional Purpose</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {project.functional_purpose.map((purpose, index) => (
                  <li key={index} className="text-slate-600">
                    {purpose}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {project.admin_feedback && (
            <Card
              className={`border-2 ${project.status === "rejected" ? "border-red-500/50 bg-red-500/5" : "border-emerald-500/50 bg-emerald-500/5"}`}
            >
              <CardHeader>
                <CardTitle className="text-black">Admin Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{project.admin_feedback}</p>
              </CardContent>
            </Card>
          )}

          {canReview && (
            <Card className="bg-purple-100 border-purple-100">
              <CardHeader>
                <CardTitle className="text-black">Review Project</CardTitle>
                <CardDescription className="text-slate-400">Approve or reject this project submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Provide feedback to the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="bg-purple-200 rounded-2xl border border-purple-300 text-black"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    disabled={submitting || !feedback}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button onClick={handleApprove} disabled={submitting} className="bg-purple-600 hover:bg-purple-700">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-6 mt-6">
          <Card className="bg-purple-100 border-purple-100">
            <CardHeader>
              <CardTitle className="text-black">Technical Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.material && (
                <div>
                  <h3 className="font-medium mb-2 text-black">Material Needed:</h3>
                  <p className="text-slate-600">{project.material}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2 text-black">Programming Languages:</h3>
                <div className="flex flex-wrap gap-2">
                  {project.programming_languages.map((lang, index) => (
                    <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2 text-black">Resources:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {project.resources.map((resource, index) => (
                    <li key={index} className="text-slate-600">
                      {resource.startsWith("http") ? (
                        <a
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center"
                        >
                          {resource}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        resource
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliverables" className="space-y-6 mt-6">
          <Card className="bg-purple-100 border-purple-100">
            <CardHeader>
              <CardTitle className="text-black">Deliverable Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array.isArray(project.deliverables) &&
                  project.deliverables.map((deliverable: any, index: number) => (
                    <div key={index} className="border-b border-slate-800 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-black">{deliverable.functionality}</h3>
                        <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                          {deliverable.days} days
                        </span>
                      </div>
                      <p className="text-slate-600">{deliverable.details}</p>
                    </div>
                  ))}

                <div className="mt-4 p-4 bg-slate-800 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-black">Total Estimated Time:</span>
                    <span className="font-bold text-black">{project.total_estimated_days} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="releases" className="space-y-6 mt-6">
          <Card className="bg-purple-100 border-purple-100">
            <CardHeader>
              <CardTitle className="text-black">Project Releases</CardTitle>
              <CardDescription className="text-slate-400">Project development stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Array.isArray(project.releases) &&
                  project.releases.map((release: any, index: number) => (
                    <div
                      key={index}
                      className="relative pl-8 pb-8 border-l-2 border-slate-700 last:border-l-0 last:pb-0"
                    >
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-purple-500"></div>
                      <div className="mb-2">
                        <h3 className="font-medium text-lg text-black">
                          Release {release.version}{" "}
                          <span className="text-sm text-slate-400 font-normal">
                            ({index === 0 ? "25%" : index === 1 ? "50%" : index === 2 ? "75%" : "100%"})
                          </span>
                        </h3>
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {Array.isArray(release.features) &&
                          release.features.map((feature: string, featureIndex: number) => (
                            <li key={featureIndex} className="text-slate-600">
                              {feature}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {(project.description || project.video_url || project.project_folder_url) && (
            <Card className="bg-purple-100 border-purple-100">
              <CardHeader>
                <CardTitle className="text-black">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.description && (
                  <div>
                    <h3 className="font-medium mb-2 text-black">Description:</h3>
                    <p className="text-slate-600">{project.description}</p>
                  </div>
                )}

                {project.video_url && (
                  <div>
                    <h3 className="font-medium mb-2 text-black">Video:</h3>
                    <a
                      href={project.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center"
                    >
                      {project.video_url}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                )}

                {project.project_folder_url && (
                  <div>
                    <h3 className="font-medium mb-2 text-black">Project Folder/Website:</h3>
                    <a
                      href={project.project_folder_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center"
                    >
                      {project.project_folder_url}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
