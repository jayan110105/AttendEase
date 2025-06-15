import { ConfigurableEventSkeleton, EventsTabsSkeleton } from "./ConfigurableEventSkeleton"

// Legacy exports for backward compatibility
export function EventCardSkeleton() {
  return <ConfigurableEventSkeleton variant="upcoming" />
}

export function InProgressEventCardSkeleton() {
  return <ConfigurableEventSkeleton variant="inprogress" />
}

export function PastEventCardSkeleton() {
  return <ConfigurableEventSkeleton variant="past" />
}

// Re-export the main components
export { ConfigurableEventSkeleton, EventsTabsSkeleton } 