import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { Icon } from '@iconify/react';
import type { PastEvent } from "@/types/event"
import { BaseEventCard } from "./BaseEventCard"
import { EVENT_ICONS } from "@/lib/event-utils"

interface PastEventCardProps {
  event: PastEvent
}

export const PastEventCard = ({ event }: PastEventCardProps) => {
  const ratingBadge = (
    <div className="bg-yellow-100 text-sm rounded px-2 py-1 flex items-center">
      <Icon icon={EVENT_ICONS.STAR} className="mr-1 text-yellow-600" />
      <span>{event.rating}</span>
    </div>
  )

  const headerInfo = (
    <>
      <div className="flex items-center text-sm text-muted-foreground">
        <Icon icon={EVENT_ICONS.CALENDAR} className="mr-1 h-4 w-4" />
        {event.date}
      </div>
      <div className="flex items-center text-sm text-primary">
        <Icon icon={EVENT_ICONS.USERS} className="mr-1 h-4 w-4" />
        {event.attendees} attended
      </div>
    </>
  )

  const cardActions = (
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
            <Icon icon={EVENT_ICONS.VIEW} className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon icon={EVENT_ICONS.DOCUMENT} className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <BaseEventCard
      title={event.title}
      headerContent={ratingBadge}
      showDropdown={false}
      actions={cardActions}
      className="pr-0"
    >
      {headerInfo}
    </BaseEventCard>
  )
} 