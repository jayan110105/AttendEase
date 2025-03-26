import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { School } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] p-4">
      <header className="container mx-auto mb-8 flex items-center justify-center py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a8a] text-white">
            <School className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Attendance System</h1>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 items-center justify-center px-4">
        <Card className="w-full max-w-md border-none shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="container mx-auto mt-8 py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Attendance System. All rights reserved.
      </footer>
    </div>
  )
}

