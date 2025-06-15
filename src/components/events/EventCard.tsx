import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"
import { format } from "date-fns"
import { Icon } from '@iconify/react';
import Link from "next/link"
import type { Event } from "@/types/event"
import type { RoleName } from "@/server/db/schema"
import { BaseEventCard } from "./BaseEventCard"
import { createAttendanceLink, EVENT_ICONS, shouldShowFeedbackQR } from "@/lib/event-utils"

interface EventCardProps {
  event: Event
  onSelectFeedbackQR: (title: string) => void
  userRole?: RoleName
}

export const EventCard = ({ event, onSelectFeedbackQR, userRole }: EventCardProps) => {
  const headerInfo = (
    <>
      <div className="flex items-center text-sm text-muted-foreground">
        <Icon icon={EVENT_ICONS.CALENDAR} className="mr-1 h-4 w-4" />
        {format(event.datetime, "MMMM d, yyyy 'at' h:mm a")}
      </div>
      <div className="flex items-center text-sm text-primary">
        <Icon icon={EVENT_ICONS.USERS} className="mr-1 h-4 w-4" />
        {event.registeredCount} registered
      </div>
    </>
  )

  const cardActions = (
    <>
      <div className="grid grid-cols-2 gap-3 pb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon icon={EVENT_ICONS.CLOCK} className="mr-1 h-4 w-4" />
          {event.duration}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon icon={EVENT_ICONS.LOCATION} className="mr-1 h-4 w-4" />
          {event.location}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Link href={createAttendanceLink(event.title)}>
          <Button size="sm">
            Attendance
          </Button>
        </Link> 
        {shouldShowFeedbackQR(event.eventType) && (
          <Button variant="outline" size="icon" onClick={() => onSelectFeedbackQR(event.title)}>
            <QrCode className="h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  )

  return (
    <BaseEventCard
      title={event.title}
      userRole={userRole}
      actions={cardActions}
    >
      {headerInfo}
    </BaseEventCard>
  )
} 