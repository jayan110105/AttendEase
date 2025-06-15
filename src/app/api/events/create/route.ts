import { NextResponse } from "next/server"
import { createEvent } from "@/lib/queries"
import { getCurrentUserWithEmployee } from "@/lib/auth-actions"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      title: string
      description: string
      eventDate: string
      eventType: string
    }

    // Get current user's employee ID
    const userEmployee = await getCurrentUserWithEmployee()
    if (!userEmployee?.employee) {
      return NextResponse.json(
        { error: "User not linked to employee account" },
        { status: 400 }
      )
    }

    // Create event in database
    await createEvent({
      title: body.title,
      description: body.description,
      eventDate: new Date(body.eventDate),
      eventType: body.eventType as "department-meeting" | "techtalk" | "workshop",
      createdBy: userEmployee.employee.employeeId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    )
  }
} 