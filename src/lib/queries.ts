import 'dotenv/config';
import { desc, eq, gte, lte, and } from "drizzle-orm";
import { db } from "@/server/db";
import { events, employees, eventAttendance, eventFeedback } from "@/server/db/schema";
import type { Event, InProgressEvent, PastEvent } from "@/types/event";

/**
 * Get all events with creator information
 */
export async function getAllEvents() {
  try {
    const allEvents = await db
      .select({
        event: events,
        creator: employees,
      })
      .from(events)
      .leftJoin(employees, eq(events.createdBy, employees.employeeId))
      .orderBy(desc(events.eventDate));

    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

/**
 * Get upcoming events (future events)
 */
export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const now = new Date();
    const upcomingEvents = await db
      .select({
        event: events,
        creator: employees,
      })
      .from(events)
      .leftJoin(employees, eq(events.createdBy, employees.employeeId))
      .where(
        and(
          gte(events.eventDate, now),
          eq(events.eventStatus, "created")
        )
      )
      .orderBy(events.eventDate);

    // Transform to Event type for frontend
    return upcomingEvents.map(({ event }) => ({
      title: event.eventTitle,
      datetime: event.eventDate,
      duration: "2 hours", // Default duration, could be added to schema later
      registeredCount: 0, // Will be calculated from attendance
      location: "TBD", // Could be added to schema later
      eventType: event.eventType === "department-meeting" ? "Department Meeting" :
                event.eventType === "techtalk" ? "Tech Talk" : "Workshop",
    }));
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

/**
 * Get in-progress events (currently happening)
 */
export async function getInProgressEvents(): Promise<InProgressEvent[]> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const inProgressEvents = await db
      .select({
        event: events,
        creator: employees,
      })
      .from(events)
      .leftJoin(employees, eq(events.createdBy, employees.employeeId))
      .where(
        and(
          gte(events.eventDate, startOfDay),
          lte(events.eventDate, endOfDay),
          eq(events.eventStatus, "inprogress")
        )
      )
      .orderBy(events.eventDate);

    // Transform to InProgressEvent type for frontend
    return inProgressEvents.map(({ event }) => {
      const eventDate = new Date(event.eventDate);
      const endTime = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000); // Assume 3 hour duration

      return {
        title: event.eventTitle,
        startTime: eventDate,
        endTime: endTime,
        location: "Lab 205", // Default location, could be added to schema
        attendeesPresent: 0, // Will be calculated from attendance
        totalRegistered: 0, // Will be calculated from registrations
        eventType: event.eventType === "department-meeting" ? "Department Meeting" :
                  event.eventType === "techtalk" ? "Tech Talk" : "Workshop",
      };
    });
  } catch (error) {
    console.error("Error fetching in-progress events:", error);
    return [];
  }
}

/**
 * Get past events with feedback data
 */
export async function getPastEvents(): Promise<PastEvent[]> {
  try {
    const now = new Date();
    const pastEvents = await db
      .select({
        event: events,
        creator: employees,
      })
      .from(events)
      .leftJoin(employees, eq(events.createdBy, employees.employeeId))
      .where(
        and(
          lte(events.eventDate, now),
          eq(events.eventStatus, "completed")
        )
      )
      .orderBy(desc(events.eventDate));

    // Transform to PastEvent type for frontend
    return pastEvents.map(({ event }) => ({
      title: event.eventTitle,
      date: event.eventDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      attendees: 0, // Will be calculated from attendance
      rating: 4.5, // Default rating, will be calculated from feedback
      maxRating: 5,
    }));
  } catch (error) {
    console.error("Error fetching past events:", error);
    return [];
  }
}



/**
 * Get all employees with their roles
 */
export async function getAllEmployees() {
  try {
    const allEmployees = await db.query.employees.findMany({
      with: {
        employeeRoles: {
          with: {
            role: true,
          },
        },
      },
      orderBy: [employees.firstName, employees.lastName],
    });

    return allEmployees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
}

/**
 * Create a new event
 */
export async function createEvent(eventData: {
  title: string;
  description?: string;
  eventDate: Date;
  eventType: "department-meeting" | "techtalk" | "workshop";
  createdBy: string;
}) {
  try {
    const newEvent = await db.insert(events).values({
      eventTitle: eventData.title,
      eventDescription: eventData.description,
      eventDate: eventData.eventDate,
      eventType: eventData.eventType,
      eventStatus: "created",
      createdBy: eventData.createdBy,
    }).returning();

    return newEvent[0];
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

/**
 * Get event attendance count
 */
export async function getEventAttendanceCount(eventId: number) {
  try {
    const attendanceCount = await db
      .select()
      .from(eventAttendance)
      .where(eq(eventAttendance.eventId, eventId));

    return attendanceCount.length;
  } catch (error) {
    console.error("Error fetching attendance count:", error);
    return 0;
  }
}

/**
 * Get event feedback average rating
 */
export async function getEventFeedbackRating(eventId: number) {
  try {
    const feedback = await db
      .select({ rating: eventFeedback.rating })
      .from(eventFeedback)
      .where(eq(eventFeedback.eventId, eventId));

    if (feedback.length === 0) return 0;

    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    return totalRating / feedback.length;
  } catch (error) {
    console.error("Error fetching feedback rating:", error);
    return 0;
  }
} 