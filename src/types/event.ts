export interface Event {
  title: string
  datetime: Date
  duration: string
  registeredCount: number
  location: string
}

export interface PastEvent {
  title: string
  date: string
  attendees: number
  rating: number
  maxRating: number
} 