export interface Event {
  title: string
  datetime: Date
  duration: string
  registeredCount: number
  location: string
  eventType: "Department Meeting" | "Tech Talk" | "Workshop"
}

export interface InProgressEvent {
  title: string
  startTime: Date
  endTime: Date
  location: string
  attendeesPresent: number
  totalRegistered: number
  eventType: "Department Meeting" | "Tech Talk" | "Workshop"
}

export interface PastEvent {
  title: string
  date: string
  attendees: number
  rating: number
  maxRating: number
} 