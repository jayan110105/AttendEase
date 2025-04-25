"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Clock, Download, Edit, MoreHorizontal, QrCode, Share2, Trash, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react";

interface Event {
  title: string
  datetime: Date
  duration: string
  registeredCount: number
  location: string
}

interface PastEvent {
  title: string
  date: string
  attendees: number
  rating: number
  maxRating: number
}

const EventCard = ({ event, onSelectFeedbackQR }: { event: Event, onSelectFeedbackQR: (title: string) => void }) => {
  return (
    <div className="rounded-lg border p-4">
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
                <MoreHorizontal className="h-4 w-4" />
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
    </div>
  )
}

const PastEventCard = ({ event }: { event: PastEvent }) => {

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
  );
}

export default function FacultyEventsPage() {
  const [date, setDate] = useState<Date>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFeedbackQR, setShowFeedbackQR] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState("")
  const qrRef = useRef<HTMLDivElement>(null);
  
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
    {
      title: "Introduction to Machine Learning",
      datetime: new Date(2025, 4, 26, 10, 0), // May 26, 2025 10:00 AM
      duration: "2 hours",
      registeredCount: 45,
      location: "Room 302"
    },
    {
      title: "Advanced Data Structures", 
      datetime: new Date(2025, 4, 25, 14, 0), // May 25, 2025 2:00 PM
      duration: "3 hours",
      registeredCount: 32,
      location: "Room 201"
    },
    {
      title: "Web Development Workshop",
      datetime: new Date(2025, 5, 2, 9, 0), // June 2, 2025 9:00 AM
      duration: "4 hours",
      registeredCount: 28,
      location: "Lab 104"
    }
  ]);

  const pastEvents: PastEvent[] = [
    {
      title: "Python Programming Basics",
      date: "April 15, 2025",
      attendees: 40,
      rating: 4.8,
      maxRating: 5
    },
    {
      title: "UI/UX Design Principles",
      date: "April 10, 2025",
      attendees: 32,
      rating: 4.2,
      maxRating: 5
    }
  ]

  const handleFeedbackQR = (title: string) => {
    setSelectedEvent(title)
    setShowFeedbackQR(true)
  }

  const handleCreateEvent = () => {
    if (!title || !date || !time || !location || !capacity) {
      alert("Please fill in all fields");
      return;
    }

    const eventDateTime = new Date(date);
    const timeParts = time.split(":").map(Number);
    const hours = timeParts[0] ?? 0;
    const minutes = timeParts[1] ?? 0;
    eventDateTime.setHours(hours, minutes);

    const newEvent: Event = {
      title,
      datetime: eventDateTime,
      duration: "TBD",
      registeredCount: 0,
      location,
    };



    setUpcomingEvents([...upcomingEvents, newEvent]);

    setTitle("");
    setDescription("");
    setDate(undefined);
    setTime("");
    setLocation("");
    setCapacity("");

    setIsDialogOpen(false);
  };

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${selectedEvent.replace(/\s+/g, "-")}-qr.png`;
      link.click();
    };
    img.src = url;
  };

  const shareQRCode = async () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const files = [new File([blob], "qr-code.png", { type: "image/png" })];
        if (navigator.share) {
          navigator.share({
            files,
            title: `Feedback QR for ${selectedEvent}`,
            text: `Scan this QR code to provide feedback for ${selectedEvent}.`
          }).catch((error) => {
            console.error("Error sharing QR Code:", error);
          });
        } else {
          alert("Sharing not supported on this device.");
        }
      }, "image/png");
    };
    img.src = url;
  };

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Manage Events</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>New Event</Button>
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
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Manage your upcoming workshops and seminars</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {upcomingEvents
                    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
                    .map((event, index) => (
                      <EventCard key={index} event={event} onSelectFeedbackQR={handleFeedbackQR}/>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Past Events</CardTitle>
                <CardDescription>View your completed workshops and seminars</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastEvents.map((event, index) => (
                    <PastEventCard key={index} event={event} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={showFeedbackQR} onOpenChange={setShowFeedbackQR}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Feedback QR Code</DialogTitle>
            <DialogDescription>
              Share this QR code with attendees to collect feedback for {selectedEvent}
            </DialogDescription>
          </DialogHeader>
          <div ref={qrRef} className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-[#1e3a8a]/20 bg-white p-4">
              <QRCodeSVG value={`https://attend-easee.vercel.app/feedback/${selectedEvent.toLowerCase().replace(/\s+/g, "-")}`} className="h-full w-full" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Attendees can scan this QR code to provide feedback for the event
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button variant="outline" className="mb-2 gap-2 sm:mb-0" onClick={downloadQRCode}>
              <Download className="h-4 w-4" />
              Download QR
            </Button>
            <Button className="gap-2" onClick={shareQRCode}>
              <Share2 className="h-4 w-4" />
              Share QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

