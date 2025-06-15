import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { Icon } from '@iconify/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { canEditEvents, canDeleteEvents } from "@/lib/roles"
import type { RoleName } from "@/server/db/schema"
import { EVENT_ICONS } from "@/lib/event-utils"

interface BaseEventCardProps {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  showDropdown?: boolean
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  userRole?: RoleName
  className?: string
  headerContent?: React.ReactNode
}

export const BaseEventCard = ({ 
  title, 
  children, 
  actions, 
  showDropdown = true,
  onView,
  onEdit,
  onDelete,
  userRole,
  className = "",
  headerContent
}: BaseEventCardProps) => {
  const hasEditPermission = userRole && canEditEvents(userRole)
  const hasDeletePermission = userRole && canDeleteEvents(userRole)
  
  return (
    <Card className={`relative rounded-lg border p-4 ${className}`}>
      {showDropdown && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="absolute top-2 right-2 p-2">
              <EllipsisVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" align="start">
            {onView && (
              <DropdownMenuItem onClick={onView}>
                <Icon icon={EVENT_ICONS.VIEW} className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
            )}
            {hasEditPermission && onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Icon icon={EVENT_ICONS.EDIT} className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {hasDeletePermission && onDelete && (
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive hover:text-destructive focus:text-destructive"
              >
                <Icon icon={EVENT_ICONS.DELETE} className="mr-2 h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      <CardHeader className="flex flex-col items-start space-y-2 p-4">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-lg font-medium hover:underline">{title}</CardTitle>
          {headerContent}
        </div>
        {children}
      </CardHeader>

      <Separator/>

      <CardContent className="p-4 pb-2">
        {actions}
      </CardContent>
    </Card>
  )
} 