"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Lock, BadgeAlert } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Feedback {
  id: string
  message: string
  created_at: string
  sender: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

interface ProjectFeedbackProps {
  projectId: string
  projectOwnerId: string
}

export function ProjectFeedback({ projectId, projectOwnerId }: ProjectFeedbackProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, profile } = useAuth()
  const { toast } = useToast()

  // Check if user can view feedback (project owner, admin, or super_admin)
  const canViewFeedback =
    user && (user.id === projectOwnerId || profile?.role === "admin" || profile?.role === "super_admin")

  useEffect(() => {
    if (canViewFeedback) {
      fetchFeedback()
    } else {
      setIsLoading(false)
    }
  }, [projectId, canViewFeedback])

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("project_feedback")
        .select(`
          id,
          message,
          created_at,
          sender:sender_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setFeedback(
        (data || []).map((item: any) => ({
          ...item,
          sender: Array.isArray(item.sender) ? item.sender[0] : item.sender,
        }))
      )
    } catch (error) {
      console.error("Error fetching feedback:", error)
      toast({
        title: "Error",
        description: "Failed to load feedback",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from("project_feedback")
        .insert({
          project_id: projectId,
          sender_id: user.id,
          message: newMessage.trim(),
        })
        .select(`
          id,
          message,
          created_at,
          sender:sender_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      setFeedback((prev) => [
        ...prev,
        {
          ...data,
          sender: Array.isArray(data.sender) ? data.sender[0] : data.sender,
        },
      ])
      setNewMessage("")
      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!canViewFeedback) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Private Feedback
          </CardTitle>
          <CardDescription>Feedback is only visible to the project owner and administrators.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>You don't have permission to view feedback for this project.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Feedback</CardTitle>
        <CardDescription>Share your thoughts and suggestions about this project</CardDescription>
        <CardDescription className="mt-2 text-sm w-1/2 text-yellow-600 bg-yellow-100 p-2 rounded-xl">
          <BadgeAlert className="h-4 w-4 inline-block mr-2" />
          Feedback is private and only visible to you and the Hub manager.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Feedback */}
        <div className="space-y-4">
          {feedback.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No feedback yet. Be the first to share your thoughts!
            </p>
          ) : (
            feedback.map((item) => (
              <div key={item.id} className="flex gap-3 p-4 bg-purple-50 rounded-lg">
                <Avatar>
                  {item.sender.avatar_url ? (
                    <AvatarImage src={item.sender.avatar_url} alt={item.sender.full_name} />
                  ) : (
                    <AvatarFallback className="bg-purple-200 text-purple-400">{item.sender.full_name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{item.sender.full_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Feedback */}
        {user && (
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your feedback about this project..."
              rows={3}
              required
            />
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" type="submit" disabled={isSubmitting || !newMessage.trim()}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
