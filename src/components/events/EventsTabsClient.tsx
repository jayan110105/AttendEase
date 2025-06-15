"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Event, InProgressEvent, PastEvent } from "@/types/event"
import { EventCard } from "@/components/events/EventCard"
import { InProgressEventCard } from "@/components/events/InProgressEventCard"
import { PastEventCard } from "@/components/events/PastEventCard"
import { NewEventDialog } from "@/components/events/NewEventDialog"
import { FeedbackQRDialog } from "@/components/events/FeedbackQRDialog"
import type { RoleName } from "@/server/db/schema"

interface EventsTabsClientProps {
  initialInProgressEvents: InProgressEvent[]
  initialUpcomingEvents: Event[]
  initialPastEvents: PastEvent[]
  userRole?: RoleName
}

export function EventsTabsClient({
  initialInProgressEvents,
  initialUpcomingEvents,
  initialPastEvents,
  userRole,
}: EventsTabsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showFeedbackQR, setShowFeedbackQR] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  
  const [activeTab, setActiveTab] = useState("inprogress")
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 })
  
  // Event data state
  const [inProgressEvents, setInProgressEvents] = useState<InProgressEvent[]>(initialInProgressEvents)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>(initialUpcomingEvents)
  const [pastEvents, setPastEvents] = useState<PastEvent[]>(initialPastEvents)
  
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
            userRole={userRole}
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
                In Progress ({inProgressEvents.length})
              </TabsTrigger>
              <TabsTrigger 
                ref={upcomingRef}
                value="upcoming" 
                className="relative bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
              >
                Upcoming ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger 
                ref={pastRef}
                value="past"
                className="relative bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
              >
                Past ({pastEvents.length})
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
                <InProgressEventCard 
                  key={index} 
                  event={event} 
                  onSelectFeedbackQR={handleFeedbackQR} 
                  userRole={userRole}
                />
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
                  <EventCard 
                    key={index} 
                    event={event} 
                    onSelectFeedbackQR={handleFeedbackQR} 
                    userRole={userRole}
                  />
                ))}
            </div>
            {upcomingEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming events scheduled
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event, index) => (
                <PastEventCard key={index} event={event} />
              ))}
            </div>
            {pastEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No past events found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <FeedbackQRDialog 
        isOpen={showFeedbackQR} 
        onOpenChange={setShowFeedbackQR} 
        selectedEvent={selectedEvent ?? ""} 
      />
    </>
  )
} 