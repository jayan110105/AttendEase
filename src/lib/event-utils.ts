/**
 * Utility functions for event handling and formatting
 */

/**
 * Creates a URL-friendly slug from an event title
 * @param title - The event title
 * @returns A URL-friendly slug
 */
export function createEventSlug(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-')
  }
  
  /**
   * Creates an attendance link for an event
   * @param title - The event title
   * @returns The attendance URL path
   */
  export function createAttendanceLink(title: string): string {
    return `/admin/attend/${createEventSlug(title)}`
  }
  
  /**
   * Common icon constants used across event components
   */
  export const EVENT_ICONS = {
    CALENDAR: "solar:calendar-date-bold",
    USERS: "solar:users-group-rounded-bold",
    CLOCK: "solar:clock-circle-bold",
    LOCATION: "mingcute:location-fill",
    VIEW: "solar:eye-bold",
    EDIT: "solar:pen-bold",
    DELETE: "solar:trash-bin-trash-bold",
    DOCUMENT: "solar:document-text-bold",
    STAR: "eva:star-fill",
  } as const
  
  /**
   * Checks if an event should show feedback QR based on event type
   * @param eventType - The type of event
   * @returns Whether to show feedback QR
   */
  export function shouldShowFeedbackQR(eventType: string): boolean {
    return eventType !== "Department Meeting"
  }