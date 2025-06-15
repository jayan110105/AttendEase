import { EventsTabsSkeleton } from "@/components/events/EventSkeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <EventsTabsSkeleton />
    </div>
  )
} 