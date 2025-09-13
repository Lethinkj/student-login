"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { useState } from "react"

interface AttendanceRecord {
  id: string
  date: string
  status: string
  check_in_time: string
  check_out_time: string
}

interface AttendanceCalendarProps {
  attendanceRecords: AttendanceRecord[]
}

export function AttendanceCalendar({ attendanceRecords }: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Create a map of dates to attendance records
  const attendanceMap = attendanceRecords.reduce(
    (acc, record) => {
      acc[record.date] = record
      return acc
    },
    {} as Record<string, AttendanceRecord>,
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200"
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "excused":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-3 w-3" />
      case "late":
        return <Clock className="h-3 w-3" />
      case "absent":
        return <XCircle className="h-3 w-3" />
      case "excused":
        return <CheckCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  // Generate calendar days
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const currentDate = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    const dateString = currentDate.toISOString().split("T")[0]
    const isCurrentMonth = currentDate.getMonth() === month
    const isToday = dateString === new Date().toISOString().split("T")[0]
    const attendance = attendanceMap[dateString]

    days.push({
      date: new Date(currentDate),
      dateString,
      isCurrentMonth,
      isToday,
      attendance,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <button onClick={() => navigateMonth(-1)} className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Previous
            </button>
            <button onClick={() => navigateMonth(1)} className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                p-2 min-h-[60px] border rounded-lg relative
                ${day.isCurrentMonth ? "bg-white" : "bg-gray-50"}
                ${day.isToday ? "ring-2 ring-blue-500" : ""}
              `}
            >
              <div className="text-sm font-medium">{day.date.getDate()}</div>
              {day.attendance && (
                <div
                  className={`absolute bottom-1 right-1 p-1 rounded text-xs ${getStatusColor(day.attendance.status)}`}
                >
                  {getStatusIcon(day.attendance.status)}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span>Late</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Excused</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
