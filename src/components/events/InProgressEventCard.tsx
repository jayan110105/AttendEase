import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EllipsisVertical, QrCode } from "lucide-react"
import { format } from "date-fns"
import { Icon } from '@iconify/react';
import Link from "next/link"
import type { InProgressEvent } from "@/types/event"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { isAdmin } from "@/lib/roles"

interface InProgressEventCardProps {
  event: InProgressEvent
  onSelectFeedbackQR: (title: string) => void
  userRole?: string
}

export const InProgressEventCard = ({ event, onSelectFeedbackQR, userRole }: InProgressEventCardProps) => {
  const attendancePercentage = Math.round((event.attendeesPresent / event.totalRegistered) * 100)

  return (
    <Card className="relative rounded-lg border p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="absolute top-2 right-2 p-2">
                <EllipsisVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="start">
            <DropdownMenuItem>
                <Icon icon="solar:eye-bold" className="mr-2 h-4 w-4" />
                View
            </DropdownMenuItem>
            {isAdmin(userRole) && (
              <>
                <DropdownMenuItem>
                    <Icon icon="solar:pen-bold" className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive hover:text-destructive focus:text-destructive">
                    <Icon icon="solar:stop-bold" className="mr-2 h-4 w-4" />
                    End Event
                </DropdownMenuItem>
              </>
            )}
        </DropdownMenuContent>
      </DropdownMenu>  

      <CardHeader className="flex flex-col items-start space-y-2 p-4">
        <CardTitle className="text-lg font-medium hover:underline">{event.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
            <Icon icon="solar:clock-circle-bold" className="mr-1 h-4 w-4" />
            {format(event.startTime, "h:mm a")} - {format(event.endTime, "h:mm a")}
        </div>
        <div className="flex items-center text-sm text-primary">
            <Icon icon="solar:users-group-rounded-bold" className="mr-1 h-4 w-4" />
            {event.attendeesPresent}/{event.totalRegistered} present ({attendancePercentage}%)
        </div>
      </CardHeader>

      <Separator/>

      <CardContent className="p-4 pb-2">
        <div className="flex items-center text-sm text-muted-foreground pb-4">
            <Icon icon="mingcute:location-fill" className="mr-1 h-4 w-4" />
            {event.location}
        </div>

        <div className="flex items-center justify-between gap-2">
            <Link href={`/admin/attend/${event.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <Button size="sm">
                    Mark Attendance
                </Button>
            </Link> 
            {event.eventType !== "Department Meeting" && (
              <Button variant="outline" size="icon" onClick={() => onSelectFeedbackQR(event.title)}>
                  <QrCode className="h-4 w-4" />
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  )
} 