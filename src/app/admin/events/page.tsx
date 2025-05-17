"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"
import type { Event, PastEvent } from "@/types/event"
import { EventCard } from "@/components/events/EventCard"
import { PastEventCard } from "@/components/events/PastEventCard"
import { NewEventDialog } from "@/components/events/NewEventDialog"
import { FeedbackQRDialog } from "@/components/events/FeedbackQRDialog"

export default function FacultyEventsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showFeedbackQR, setShowFeedbackQR] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState("")
  
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
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Manage Events</h1>
          <NewEventDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onCreateEvent={handleCreateEvent}
          />
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

      <FeedbackQRDialog
        isOpen={showFeedbackQR}
        onOpenChange={setShowFeedbackQR}
        selectedEvent={selectedEvent}
      />
    </DashboardLayout>
  )
}

