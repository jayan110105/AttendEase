"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Event, PastEvent, InProgressEvent } from "@/types/event"
import { EventCard } from "@/components/events/EventCard"
import { PastEventCard } from "@/components/events/PastEventCard"
import { InProgressEventCard } from "@/components/events/InProgressEventCard"
import { NewEventDialog } from "@/components/events/NewEventDialog"
import { FeedbackQRDialog } from "@/components/events/FeedbackQRDialog"

export default function StaffEventsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showFeedbackQR, setShowFeedbackQR] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState("")
  const [activeTab, setActiveTab] = useState("inprogress")
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 })
  
  const inProgressRef = useRef<HTMLButtonElement>(null)
  const upcomingRef = useRef<HTMLButtonElement>(null)
  const pastRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const updateSlider = () => {
      let activeRef = inProgressRef
      if (activeTab === "upcoming") activeRef = upcomingRef
      else if (activeTab === "past") activeRef = pastRef
      
      if (activeRef.current) {
        const { offsetLeft, offsetWidth } = activeRef.current
        setSliderStyle({ left: offsetLeft, width: offsetWidth })
      }
    }
    
    updateSlider()
    // Add a small delay to ensure DOM is updated
    setTimeout(updateSlider, 10)
  }, [activeTab])

  const [inProgressEvents] = useState<InProgressEvent[]>([
    {
      title: "React Best Practices Workshop",
      startTime: new Date(2025, 0, 25, 9, 0), // Today 9:00 AM
      endTime: new Date(2025, 0, 25, 12, 0), // Today 12:00 PM
      location: "Lab 205",
      attendeesPresent: 28,
      totalRegistered: 35,
      eventType: "Workshop"
    },
    {
      title: "Database Design Seminar",
      startTime: new Date(2025, 0, 25, 14, 0), // Today 2:00 PM
      endTime: new Date(2025, 0, 25, 17, 0), // Today 5:00 PM
      location: "Room 301",
      attendeesPresent: 18,
      totalRegistered: 25,
      eventType: "Tech Talk"
    }
  ])

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
    {
      title: "Introduction to Machine Learning",
      datetime: new Date(2025, 4, 26, 10, 0), // May 26, 2025 10:00 AM
      duration: "2 hours",
      registeredCount: 45,
      location: "Room 302",
      eventType: "Workshop"
    },
    {
      title: "Advanced Data Structures", 
      datetime: new Date(2025, 4, 25, 14, 0), // May 25, 2025 2:00 PM
      duration: "3 hours",
      registeredCount: 32,
      location: "Room 201",
      eventType: "Tech Talk"
    },
    {
      title: "Web Development Workshop",
      datetime: new Date(2025, 5, 2, 9, 0), // June 2, 2025 9:00 AM
      duration: "4 hours",
      registeredCount: 28,
      location: "Lab 104",
      eventType: "Workshop"
    }
  ])

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

  const handleCreateEvent = (newEvent: Event) => {
    setUpcomingEvents([...upcomingEvents, newEvent])
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Manage Events</h1>
          <NewEventDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onCreateEvent={handleCreateEvent}
          />
        </div>

        <Tabs defaultValue="inprogress" className="space-y-4" onValueChange={setActiveTab}>
          <div className="relative">
            <TabsList className="relative bg-transparent p-0 h-auto gap-6">
              <TabsTrigger 
                ref={inProgressRef}
                value="inprogress" 
                className="relative bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger 
                ref={upcomingRef}
                value="upcoming" 
                className="relative bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger 
                ref={pastRef}
                value="past"
                className="relative bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
              >
                Past
              </TabsTrigger>
            </TabsList>
            <div 
              className="absolute bottom-0 h-[3px] bg-black transition-all duration-300 ease-in-out"
              style={{
                left: `${sliderStyle.left}px`,
                width: `${sliderStyle.width}px`
              }}
            />
          </div>

          <TabsContent value="inprogress" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inProgressEvents.map((event, index) => (
                <InProgressEventCard key={index} event={event} onSelectFeedbackQR={handleFeedbackQR}/>
              ))}
            </div>
            {inProgressEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No events currently in progress
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents
                .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
                .map((event, index) => (
                  <EventCard key={index} event={event} onSelectFeedbackQR={handleFeedbackQR}/>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event, index) => (
                <PastEventCard key={index} event={event} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FeedbackQRDialog
        isOpen={showFeedbackQR}
        onOpenChange={setShowFeedbackQR}
        selectedEvent={selectedEvent}
      />
    </>
  )
}

