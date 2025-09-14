"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, Info } from "lucide-react"

export default function NewPresentationPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "talk",
    preferredDate: "",
    preferredTime: "",
    duration: "60",
    location: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    setIsSubmitting(true)

    try {
      // Calculate start and end dates
      const startDate = new Date(`${formData.preferredDate}T${formData.preferredTime}`)
      const endDate = new Date(startDate.getTime() + Number.parseInt(formData.duration) * 60000)

      const { error } = await supabase.from("events").insert({
        user_id: user.id,
        presenter_id: user.id,
        title: formData.title,
        description: formData.description,
        event_type: formData.eventType as "talk" | "workshop" | "conference" | "hackathon" || "hackathon",
        preferred_date: startDate.toISOString(),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        duration_minutes: Number.parseInt(formData.duration),
        location: formData.location,
        status: "pending",
      })

      if (error) throw error

      toast({
        title: "Presentation Scheduled",
        description: "Your presentation has been submitted for approval.",
      })

      router.push("/dashboard/presentations")
    } catch (error) {
      console.error("Error creating presentation:", error)
      toast({
        title: "Error",
        description: "Failed to schedule presentation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Schedule New Presentation</h1>
        <p className="text-gray-600 mt-2">Submit your presentation for approval by the admin team.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Presentation Details</CardTitle>
          <CardDescription>Fill in the information about your presentation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="eventType">Presentation Type</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHint(!showHint)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800"
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
                {showHint && (
                  <Alert className="mt-2 bg-purple-50 border-purple-200 text-purple-800">
                    <AlertDescription>
                      <strong>Talk/Conference:</strong> A presentation where you
                      share knowledge with an audience. These are generally less
                      interactive.
                      <br />
                      <strong>Workshop/User Group:</strong> An interactive
                      session where participants actively engage in activities, discussions, or hands-on learning.
                      <br />
                      <strong>Hackathon:</strong> An event where participants
                      collaborate intensively on software projects, typically over a short period.
                    </AlertDescription>
                  </Alert>
                )}
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => handleSelectChange("eventType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="talk">Talk</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter presentation title"
                  className="border-2 border-purple-200 focus:border-purple-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your presentation"
                  className="border-2 border-purple-200 focus:border-purple-400"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Preferred Date
                  </Label>
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="border-2 border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    Preferred Time
                  </Label>
                  <Input
                    id="preferredTime"
                    name="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="border-2 border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => handleSelectChange("duration", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="150">2.5 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                      <SelectItem value="210">3.5 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Barcelona Campus"
                    className="border-2 border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-purple-600 text-white hover:bg-purple-700 hover:text-white">
                {isSubmitting ? "Scheduling..." : "Schedule Presentation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
