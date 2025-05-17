import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarIcon, Clock, Edit, EllipsisVertical, QrCode, Trash, Users } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import type { Event } from "@/types/event"
import { Card } from "@/components/ui/card"

interface EventCardProps {
  event: Event
  onSelectFeedbackQR: (title: string) => void
}

export const EventCard = ({ event, onSelectFeedbackQR }: EventCardProps) => {
  return (
    <Card className="rounded-lg border p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{event.title}</h3>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {format(event.datetime, "MMMM d, yyyy 'at' h:mm a")}
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {event.duration}
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              {event.registeredCount} registered
            </div>
          </div>
          <p className="text-sm">{event.location}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            View Details
          </Button>
          <Link href={`/admin/attend/${event.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <Button size="sm">
              Attendance
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onSelectFeedbackQR(event.title)}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Feedback QR
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
} 