import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"
import { format } from "date-fns"
import { Icon } from '@iconify/react';
import Link from "next/link"
import type { InProgressEvent } from "@/types/event"
import type { RoleName } from "@/server/db/schema"
import { BaseEventCard } from "./BaseEventCard"
import { createAttendanceLink, EVENT_ICONS, shouldShowFeedbackQR } from "@/lib/event-utils"

interface InProgressEventCardProps {
  event: InProgressEvent
  onSelectFeedbackQR: (title: string) => void
  userRole?: RoleName
}

export const InProgressEventCard = ({ event, onSelectFeedbackQR, userRole }: InProgressEventCardProps) => {
  const attendancePercentage = (event.attendeesPresent / event.totalRegistered) * 100
  
  const headerInfo = (
    <>
      <div className="flex items-center text-sm text-muted-foreground">
        <Icon icon={EVENT_ICONS.CLOCK} className="mr-1 h-4 w-4" />
        {format(event.startTime, "h:mm a")} - {format(event.endTime, "h:mm a")}
      </div>
      <div className="flex items-center text-sm text-primary">
        <Icon icon={EVENT_ICONS.USERS} className="mr-1 h-4 w-4" />
        {event.attendeesPresent} / {event.totalRegistered} present ({attendancePercentage.toFixed(0)}%)
      </div>
    </>
  )

  const cardActions = (
    <>
      <div className="flex items-center text-sm text-muted-foreground pb-4">
        <Icon icon={EVENT_ICONS.LOCATION} className="mr-1 h-4 w-4" />
        {event.location}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Link href={createAttendanceLink(event.title)}>
          <Button size="sm">
            Mark Attendance
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