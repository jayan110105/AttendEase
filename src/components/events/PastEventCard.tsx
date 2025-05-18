import { Button } from "@/components/ui/button"
import { CalendarIcon, Users } from "lucide-react"
import type { PastEvent } from "@/types/event"

interface PastEventCardProps {
  event: PastEvent
}

export const PastEventCard = ({ event }: PastEventCardProps) => {
  const renderStars = (rating: number, maxRating: number) => {
    return Array.from({ length: maxRating }).map((_, index) => (
      <span key={index}>{index < Math.floor(rating) ? "★" : "☆"}</span>
    ))
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{event.title}</h3>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {event.date}
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              {event.attendees} attended
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-yellow-500">{renderStars(event.rating, event.maxRating)}</span>
            <span className="ml-1">{event.rating}/{event.maxRating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            View Report
          </Button>
        </div>
      </div>
    </div>
  )
} 