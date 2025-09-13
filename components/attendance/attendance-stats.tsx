"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, Calendar, TrendingUp } from "lucide-react"

interface AttendanceRecord {
  id: string
  date: string
  status: string
  check_in_time: string
}

interface AttendanceStatsProps {
  attendanceRecords: AttendanceRecord[]
}

export function AttendanceStats({ attendanceRecords }: AttendanceStatsProps) {
  const totalDays = attendanceRecords.length
  const presentDays = attendanceRecords.filter((r) => r.status === "present").length
  const lateDays = attendanceRecords.filter((r) => r.status === "late").length
  const absentDays = attendanceRecords.filter((r) => r.status === "absent").length
  const excusedDays = attendanceRecords.filter((r) => r.status === "excused").length

  const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays + excusedDays) / totalDays) * 100 : 0

  // Calculate streak (consecutive present/late days)
  let currentStreak = 0
  for (let i = 0; i < attendanceRecords.length; i++) {
    const record = attendanceRecords[i]
    if (record.status === "present" || record.status === "late") {
      currentStreak++
    } else {
      break
    }
  }

  // Calculate average check-in time
  const checkInTimes = attendanceRecords
    .filter((r) => r.check_in_time && (r.status === "present" || r.status === "late"))
    .map((r) => {
      const time = new Date(r.check_in_time)
      return time.getHours() * 60 + time.getMinutes() // Convert to minutes
    })

  const avgCheckInMinutes = checkInTimes.length > 0 ? checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length : 0
  const avgCheckInTime =
    avgCheckInMinutes > 0
      ? `${Math.floor(avgCheckInMinutes / 60)}:${String(Math.floor(avgCheckInMinutes % 60)).padStart(2, "0")}`
      : "N/A"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendancePercentage.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {presentDays + lateDays + excusedDays} of {totalDays} days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Days</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{presentDays}</div>
          <p className="text-xs text-muted-foreground">On time arrivals</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{lateDays}</div>
          <p className="text-xs text-muted-foreground">After 9:00 AM</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{currentStreak}</div>
          <p className="text-xs text-muted-foreground">Consecutive days</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Attendance Breakdown</CardTitle>
          <CardDescription>Last {totalDays} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Present</span>
              </div>
              <span className="text-sm font-medium">{presentDays} days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Late</span>
              </div>
              <span className="text-sm font-medium">{lateDays} days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Absent</span>
              </div>
              <span className="text-sm font-medium">{absentDays} days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Excused</span>
              </div>
              <span className="text-sm font-medium">{excusedDays} days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Performance Insights</CardTitle>
          <CardDescription>Your attendance patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Average Check-in Time</p>
              <p className="text-2xl font-bold text-blue-600">{avgCheckInTime}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Attendance Grade</p>
              <p className="text-lg font-bold">
                {attendancePercentage >= 95 ? (
                  <span className="text-green-600">Excellent</span>
                ) : attendancePercentage >= 85 ? (
                  <span className="text-blue-600">Good</span>
                ) : attendancePercentage >= 75 ? (
                  <span className="text-yellow-600">Fair</span>
                ) : (
                  <span className="text-red-600">Needs Improvement</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
