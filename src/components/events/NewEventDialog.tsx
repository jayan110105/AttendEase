import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useState } from "react"
import type { Event } from "@/types/event"
import { Icon } from '@iconify/react';
import { isAdmin } from "@/lib/roles";

interface NewEventDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateEvent: (event: Event) => void
  userRole?: string
}

export const NewEventDialog = ({ isOpen, onOpenChange, onCreateEvent, userRole }: NewEventDialogProps) => {
  const [date, setDate] = useState<Date>()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [eventType, setEventType] = useState<"Department Meeting" | "Tech Talk" | "Workshop" | "">("")

  const handleCreateEvent = () => {
    if (!title || !date || !time || !location || !eventType) {
      alert("Please fill in all fields")
      return
    }

    const eventDateTime = new Date(date)
    const timeParts = time.split(":").map(Number)
    const hours = timeParts[0] ?? 0
    const minutes = timeParts[1] ?? 0
    eventDateTime.setHours(hours, minutes)

    const newEvent: Event = {
      title,
      datetime: eventDateTime,
      duration: "TBD",
      registeredCount: 0,
      location,
      eventType,
    }

    onCreateEvent(newEvent)

    setTitle("")
    setDescription("")
    setDate(undefined)
    setTime("")
    setLocation("")
    setEventType("")
    onOpenChange(false)
  }

  // Only show dialog if user is admin
  if (!isAdmin(userRole)) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => onOpenChange(true)} className="flex items-center font-bold rounded-lg p-3">
            <Icon icon="mingcute:add-line" className="h-5 w-5" />
            New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[444px] !rounded-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold tracking-tight">Create New Event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 pb-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input className="py-2" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter event title" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter event description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-between text-left font-normal", !date && "text-muted-foreground")}
                  >
                    {date ? format(date, "PPP") : "Select date"}
                    <Icon icon="solar:calendar-date-bold" className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Time</Label>
              <Select onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input className="py-2" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Room/Hall" />
            </div>
            <div className="grid gap-2">
              <Label>Event Type</Label>
              <Select onValueChange={(value) => setEventType(value as "Department Meeting" | "Tech Talk" | "Workshop")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Department Meeting">Department Meeting</SelectItem>
                  <SelectItem value="Tech Talk">Tech Talk</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleCreateEvent} className="font-medium py-5">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 