import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import type { Event } from "@/types/event"
import { Icon } from '@iconify/react';
interface NewEventDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateEvent: (event: Event) => void
}

export const NewEventDialog = ({ isOpen, onOpenChange, onCreateEvent }: NewEventDialogProps) => {
  const [date, setDate] = useState<Date>()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState("")

  const handleCreateEvent = () => {
    if (!title || !date || !time || !location || !capacity) {
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
    }

    onCreateEvent(newEvent)

    setTitle("")
    setDescription("")
    setDate(undefined)
    setTime("")
    setLocation("")
    setCapacity("")
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => onOpenChange(true)} className="flex items-center font-bold rounded-lg p-3">
            <Icon icon="mingcute:add-line" className="h-5 w-5" />
            New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Fill in the details to create a new workshop or seminar.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter event title" />
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
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
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
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Room/Hall" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Max participants" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleCreateEvent}>Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 