import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { Icon } from '@iconify/react';
import type { PastEvent } from "@/types/event"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PastEventCardProps {
  event: PastEvent
}

export const PastEventCard = ({ event }: PastEventCardProps) => {

  return (
    <Card className="rounded-lg border p-4">

      <CardHeader className="flex flex-col items-start space-y-2 p-4 pr-0">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-lg font-medium hover:underline">{event.title}</CardTitle>
          <div className="bg-yellow-100 text-sm rounded px-2 py-1 flex items-center">
              <Icon icon="eva:star-fill" className="mr-1 text-yellow-600" />
              <span>{event.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
            <Icon icon="solar:calendar-date-bold" className="mr-1 h-4 w-4" />
            {event.date}
        </div>
        <div className="flex items-center text-sm text-primary">
            <Icon icon="solar:users-group-rounded-bold" className="mr-1 h-4 w-4" />
            {event.attendees} attended
        </div>
      </CardHeader>

      <Separator/>

      <CardContent className="p-4 pb-2 pr-0">
        <div className="flex items-center justify-between gap-2">
          <Button size="sm">
            View Report
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="p-1">
                    <EllipsisVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" align="start">
                <DropdownMenuItem>
                    <Icon icon="solar:eye-bold" className="mr-2 h-4 w-4" />
                    View
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Icon icon="solar:document-text-bold" className="mr-2 h-4 w-4" />
                    Export
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>  
        </div>
      </CardContent>
    </Card>
  )
} 