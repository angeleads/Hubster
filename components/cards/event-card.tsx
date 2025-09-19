import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, MapPin, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type EventProps = {
  event: {
    id: string
    title: string
    description: string | null
    event_type: "talk" | "workshop" | "conference" | "hackathon"
    start_date: string
    end_date: string
    location: string | null
    presenter_id: string
    duration_minutes: number
    status: string
  }
}

export function EventCard({ event }: EventProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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
      case "conference":
        return "bg-purple-100 text-purple-800"
      case "workshop":
        return "bg-green-100 text-green-800"
      case "hackathon":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "user_group":
        return "User Group"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardContent className="p-0 flex flex-col flex-grow">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg">{event.title}</h3>
            <Badge className={getEventTypeColor(event.event_type)}>{getEventTypeLabel(event.event_type)}</Badge>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(event.start_date)}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {formatTime(event.start_date)} - {formatTime(event.end_date)} ({event.duration_minutes} min)
              </span>
            </div>
            {event.location && (
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="border-t p-3 bg-purple-50 flex justify-end">
          <Link href={`/dashboard/presentations/${event.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
