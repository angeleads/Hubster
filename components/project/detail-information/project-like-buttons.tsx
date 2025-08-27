"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProjectLikeButtonProps {
  projectId: string
  initialLikesCount: number
}

export function ProjectLikeButton({ projectId, initialLikesCount }: ProjectLikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      checkIfLiked()
    }
  }, [user, projectId])

  const checkIfLiked = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("project_likes")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) {
        console.error("Error checking like status:", error)
        return
      }

      setIsLiked(!!data)
    } catch (error) {
      console.error("Error checking like status:", error)
    }
  }

  const handleToggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like projects",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      if (isLiked) {
        // Unlike the project
        const { error: deleteError } = await supabase
          .from("project_likes")
          .delete()
          .eq("project_id", projectId)
          .eq("user_id", user.id)

        if (deleteError) throw deleteError

        // Update likes count in projects table
        const { error: updateError } = await supabase
          .from("projects")
          .update({ likes_count: Math.max(0, likesCount - 1) })
          .eq("id", projectId)

        if (updateError) throw updateError

        setIsLiked(false)
        setLikesCount((prev) => Math.max(0, prev - 1))
      } else {
        // Like the project
        const { error: insertError } = await supabase.from("project_likes").insert({
          project_id: projectId,
          user_id: user.id,
        })

        if (insertError) throw insertError

        // Update likes count in projects table
        const { error: updateError } = await supabase
          .from("projects")
          .update({ likes_count: likesCount + 1 })
          .eq("id", projectId)

        if (updateError) throw updateError

        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="sm"
      onClick={handleToggleLike}
      disabled={isLoading}
      className="gap-2 bg-pink-300 hover:bg-pink-400 text-white hover:text-white"
    >
      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
      {likesCount}
    </Button>
  )
}
