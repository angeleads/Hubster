"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react"
import Link from "next/link"

type Event = {
  id: string
  title: string
  description: string
  event_type: "talk" | "workshop" | "conference" | "hackathon"
  start_date: string
  end_date: string
  location: string
  presenter_id: string
  presenter_name: string
  status: "pending" | "approved" | "rejected"
  presentation_files: string[] | null
}

type EventFeedback = {
  id: string
  event_id: string
  sender_id: string
  message: string
  rating: number | null
  created_at: string
}

export default function PresentationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [adminFeedback, setAdminFeedback] = useState<EventFeedback | null>(null)

  const eventId = params.id as string

  useEffect(() => {
    if (profile) {
      if (profile.role !== "admin") {
        router.push("/dashboard")
        return
      }
      fetchEvent()
    }
  }, [profile, eventId, router])

  const fetchEvent = async () => {
    try {
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select(`
          *,
          profiles!events_presenter_id_fkey(full_name)
        `)
        .eq("id", eventId)
        .single()

      if (eventError) throw eventError

      // Get admin feedback if exists
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("event_feedback")
        .select("*")
        .eq("event_id", eventId)
        .eq("sender_id", profile?.id)
        .maybeSingle()

      if (feedbackError && feedbackError.code !== "PGRST116") {
        console.error("Error fetching feedback:", feedbackError)
      }

      setEvent({
        ...eventData,
        presenter_name: eventData.profiles?.full_name || "Unknown",
      })
      setAdminFeedback(feedbackData)
      setFeedback(feedbackData?.message || "")
    } catch (error) {
      console.error("Error fetching event:", error)
      toast({
        title: "Error",
        description: "Failed to load presentation details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!event) return
    setSubmitting(true)

    try {
      // Update event status
      const { error: eventError } = await supabase.from("events").update({ status: "approved" }).eq("id", eventId)

      if (eventError) throw eventError

      // Add or update feedback if provided
      if (feedback.trim()) {
        if (adminFeedback) {
          // Update existing feedback
          const { error: feedbackError } = await supabase
            .from("event_feedback")
            .update({ message: feedback })
            .eq("id", adminFeedback.id)

          if (feedbackError) throw feedbackError
        } else {
          // Create new feedback
          const { error: feedbackError } = await supabase.from("event_feedback").insert({
            event_id: eventId,
            sender_id: profile?.id,
            message: feedback,
          })

          if (feedbackError) throw feedbackError
        }
      }

      toast({
        title: "Presentation Approved",
        description: "The presentation has been approved successfully",
      })

      // Refresh event data
      fetchEvent()
    } catch (error) {
      console.error("Error approving presentation:", error)
      toast({
        title: "Error",
        description: "Failed to approve presentation",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!event || !feedback) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback before rejecting the presentation",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // Update event status
      const { error: eventError } = await supabase.from("events").update({ status: "rejected" }).eq("id", eventId)

      if (eventError) throw eventError

      // Add or update feedback
      if (adminFeedback) {
        // Update existing feedback
        const { error: feedbackError } = await supabase
          .from("event_feedback")
          .update({ message: feedback })
          .eq("id", adminFeedback.id)

        if (feedbackError) throw feedbackError
      } else {
        // Create new feedback
        const { error: feedbackError } = await supabase.from("event_feedback").insert({
          event_id: eventId,
          sender_id: profile?.id,
          message: feedback,
        })

        if (feedbackError) throw feedbackError
      }

      toast({
        title: "Presentation Rejected",
        description: "The presentation has been rejected with feedback",
      })

      // Refresh event data
      fetchEvent()
    } catch (error) {
      console.error("Error rejecting presentation:", error)
      toast({
        title: "Error",
        description: "Failed to reject presentation",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "talk":
        return "bg-blue-100 text-blue-800"
      case "workshop":
        return "bg-green-100 text-green-800"
      case "conference":
        return "bg-purple-100 text-purple-800"
      case "hackathon":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!profile || profile.role !== "admin" || !event) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/admin/presentations"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Presentations
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Presentation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">{event.description}</p>
              </div>

              {event.presentation_files && event.presentation_files.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Attached Files</h3>
                  {event.presentation_files.map((fileUrl, index) => (
                    <div key={index} className="mb-2">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Presentation File {index + 1}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                      <a href={fileUrl} download className="flex items-center text-blue-600 hover:underline mt-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download File {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {event.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Review Presentation</CardTitle>
                <CardDescription>Approve or reject this presentation request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Provide feedback to the presenter..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    disabled={submitting || !feedback}
                    className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button onClick={handleApprove} disabled={submitting}>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {adminFeedback && event.status !== "pending" && (
            <Card className={event.status === "rejected" ? "border-red-200" : "border-green-200"}>
              <CardHeader className={event.status === "rejected" ? "bg-red-50" : "bg-green-50"}>
                <CardTitle>Admin Feedback</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p>{adminFeedback.message}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{formatDate(event.start_date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  {formatTime(event.start_date)} - {formatTime(event.end_date)}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{event.location}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Presenter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span>{event.presenter_name}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
