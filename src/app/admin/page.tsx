"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, LineChart, XAxis, Line, Bar, CartesianGrid } from "recharts"
import { Button } from "@/components/ui/button"
import { Filter, Import, Users, UserCheck, UserX, FileText } from "lucide-react"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const barData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const lineData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function AdminDashboard() {
  const [chartPeriod, setChartPeriod] = useState("weekly")
  const [classFilter, setClassFilter] = useState("school")

  return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Attendance Overview</h1>
            <p className="text-sm text-muted-foreground">Last Updated: 11:15 AM 02 Feb 2024</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Import className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <h2 className="text-3xl font-bold">452</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 2%</span> compared to last semester
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <h2 className="text-3xl font-bold">360</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 3%</span> compared to last week
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent</p>
                  <h2 className="text-3xl font-bold">30</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="text-red-500">↓ 5%</span> compared to last week
                  </p>
                </div>
                <div className="rounded-full bg-red-100 p-2 text-red-600">
                  <UserX className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leave Applications</p>
                  <h2 className="text-3xl font-bold">12</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="text-amber-500">↑ 2</span> pending approval
                  </p>
                </div>
                <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gender Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-none shadow-sm lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Female</p>
                  <h2 className="text-3xl font-bold">62</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 5%</span> compared to last semester
                  </p>
                </div>
                <div className="rounded-full bg-pink-100 p-2 text-pink-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-sm lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Male</p>
                  <h2 className="text-3xl font-bold">173</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 2%</span> compared to last semester
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Comparison Chart */}
        <Card className="overflow-hidden border-none shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Attendance Comparison Chart</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={chartPeriod === "daily" ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => setChartPeriod("daily")}
                >
                  Daily
                </Button>
                <Button
                  variant={chartPeriod === "weekly" ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => setChartPeriod("weekly")}
                >
                  Weekly
                </Button>
                <Button
                  variant={chartPeriod === "monthly" ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => setChartPeriod("monthly")}
                >
                  Monthly
                </Button>
              </div>
            </div>
            <div>
              <ChartContainer config={chartConfig} className="h-96">
                <LineChart
                  accessibilityLayer
                  data={lineData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value: string) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-desktop)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Class Wise Attendance */}
        <Card className="overflow-hidden border-none shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Class Wise Attendance</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={classFilter === "school" ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => setClassFilter("school")}
                >
                  Jr. School
                </Button>
                <Button
                  variant={classFilter === "high" ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => setClassFilter("high")}
                >
                  Sr. School
                </Button>
                <Button
                  variant={classFilter === "college" ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => setClassFilter("college")}
                >
                  College
                </Button>
              </div>
            </div>
            <div>
              <ChartContainer config={chartConfig} className="h-96">
                <BarChart accessibilityLayer data={barData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value: string) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

