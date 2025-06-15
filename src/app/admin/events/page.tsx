import { Suspense } from "react"
import { EventsTabsClient } from "@/components/events/EventsTabsClient"
import { EventsTabsSkeleton } from "@/components/events/EventSkeleton"
import { getUpcomingEvents, getInProgressEvents, getPastEvents } from "@/lib/queries"
import { getCurrentUserRole } from "@/lib/auth-actions"

async function EventsData() {
  // Fetch all data in parallel
  const [inProgressEvents, upcomingEvents, pastEvents, userRole] = await Promise.all([
    getInProgressEvents(),
    getUpcomingEvents(), 
    getPastEvents(),
    getCurrentUserRole(),
  ])

  return (
    <EventsTabsClient
      initialInProgressEvents={inProgressEvents}
      initialUpcomingEvents={upcomingEvents}
      initialPastEvents={pastEvents}
      userRole={userRole}
    />
  )
}

export default function StaffEventsPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<EventsTabsSkeleton />}>
        <EventsData />
      </Suspense>
    </div>
  )
}

