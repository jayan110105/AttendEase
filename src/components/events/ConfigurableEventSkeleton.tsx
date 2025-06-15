import { Skeleton } from "@/components/ui/skeleton"

interface ConfigurableEventSkeletonProps {
  variant: 'upcoming' | 'inprogress' | 'past'
  showProgress?: boolean
  showRating?: boolean
}

export function ConfigurableEventSkeleton({ 
  variant, 
  showProgress = false, 
  showRating = false 
}: ConfigurableEventSkeletonProps) {
  // Determine if we should show rating based on variant or explicit prop
  const shouldShowRating = variant === 'past' || showRating
  // Determine if we should show progress based on variant or explicit prop
  const shouldShowProgress = variant === 'inprogress' || showProgress

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-3/4" />
        {shouldShowRating ? (
          <Skeleton className="h-5 w-20 rounded-full" />
        ) : (
          <Skeleton className="h-4 w-16" />
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
        {variant === 'upcoming' && (
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        )}
      </div>
      
      {shouldShowProgress && (
        <div className="space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2">
        {variant === 'past' ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
        {variant === 'inprogress' ? (
          <div className="flex gap-2 flex-1 ml-4">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </div>
        ) : (
          <Skeleton className="h-8 w-20" />
        )}
      </div>
    </div>
  )
}

export function EventsTabsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Tabs skeleton */}
      <div className="flex gap-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
      
      {/* Events grid skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ConfigurableEventSkeleton variant="inprogress" />
        <ConfigurableEventSkeleton variant="inprogress" />
        <ConfigurableEventSkeleton variant="inprogress" />
        <ConfigurableEventSkeleton variant="upcoming" />
        <ConfigurableEventSkeleton variant="upcoming" />
        <ConfigurableEventSkeleton variant="past" />
      </div>
    </div>
  )
} 