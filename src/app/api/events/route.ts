import { NextResponse } from "next/server"
import { getUpcomingEvents, getInProgressEvents, getPastEvents } from "@/lib/queries"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "upcoming") {
      const events = await getUpcomingEvents()
      return NextResponse.json(events)
    }
    
    if (type === "inprogress") {
      const events = await getInProgressEvents()
      return NextResponse.json(events)
    }
    
    if (type === "past") {
      const events = await getPastEvents()
      return NextResponse.json(events)
    }

    // If no type specified, return all
    const [upcoming, inProgress, past] = await Promise.all([
      getUpcomingEvents(),
      getInProgressEvents(),
      getPastEvents(),
    ])

    return NextResponse.json({
      upcoming,
      inProgress,
      past,
    })
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
} 