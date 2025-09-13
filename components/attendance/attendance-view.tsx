"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Calendar, Clock, CheckCircle, XCircle, MapPin, Users } from "lucide-react"
import { useState } from "react"
import { MarkAttendanceDialog } from "./mark-attendance-dialog"
import { AttendanceCalendar } from "./attendance-calendar"
import { AttendanceStats } from "./attendance-stats"

interface AttendanceRecord {
  id: string
  user_id: string
  date: string
  status: string
  check_in_time: string
  check_out_time: string
  location: string
  created_at: string
  user?: {
    full_name: string
    student_id: string
    department: string
    year: number
  }
}

interface AttendanceViewProps {
  user: {
    id: string
    full_name: string
    role: string
    email: string
  }
  attendanceRecords: AttendanceRecord[]
  todayAttendance: AttendanceRecord | null
}

export function AttendanceView({ user, attendanceRecords, todayAttendance }: AttendanceViewProps) {
  const [markAttendanceDialogOpen, setMarkAttendanceDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>
      case "absent":
        return <Badge variant="destructive">Absent</Badge>
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>
      case "excused":
        return <Badge className="bg-blue-100 text-blue-800">Excused</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "late":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "excused":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A"
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0]
    return dateString === today
  }

  return (
    <DashboardLayout user={user} activeTab="attendance">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === "student" ? "My Attendance" : "Attendance Management"}
            </h1>
            <p className="text-gray-600">
              {user.role === "student"
                ? "Track your daily attendance and view your attendance history"
                : "Monitor student attendance and generate reports"}
            </p>
          </div>
          {user.role === "student" && !todayAttendance && (
            <Button onClick={() => setMarkAttendanceDialogOpen(true)} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Mark Attendance
            </Button>
          )}
        </div>

        {user.role === "student" ? (
          /* Student View */
          <div className="space-y-6">
            {/* Today's Status */}
            <Card className={todayAttendance ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Today's Attendance</h3>
                    {todayAttendance ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(todayAttendance.status)}
                          {getStatusBadge(todayAttendance.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Check-in: {formatTime(todayAttendance.check_in_time)}</p>
                          {todayAttendance.check_out_time && (
                            <p>Check-out: {formatTime(todayAttendance.check_out_time)}</p>
                          )}
                          {todayAttendance.location && <p>Location: {todayAttendance.location}</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-800">Not marked yet</span>
                      </div>
                    )}
                  </div>
                  {!todayAttendance && <Button onClick={() => setMarkAttendanceDialogOpen(true)}>Mark Now</Button>}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Stats */}
            <AttendanceStats attendanceRecords={attendanceRecords} />

            {/* Tabs for different views */}
            <Tabs defaultValue="recent" className="space-y-6">
              <TabsList>
                <TabsTrigger value="recent">Recent Records</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                {attendanceRecords.map((record) => (
                  <Card key={record.id} className={isToday(record.date) ? "border-blue-200 bg-blue-50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm font-medium">{formatDate(record.date)}</p>
                            {isToday(record.date) && <p className="text-xs text-blue-600">Today</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            {getStatusBadge(record.status)}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>In: {formatTime(record.check_in_time)}</p>
                          {record.check_out_time && <p>Out: {formatTime(record.check_out_time)}</p>}
                          {record.location && (
                            <p className="flex items-center gap-1 justify-end">
                              <MapPin className="h-3 w-3" />
                              {record.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {attendanceRecords.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No attendance records found.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="calendar">
                <AttendanceCalendar attendanceRecords={attendanceRecords} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          /* Faculty/Admin View */
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="records">All Records</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{new Set(attendanceRecords.map((r) => r.user_id)).size}</p>
                        <p className="text-sm text-gray-600">Total Students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {attendanceRecords.filter((r) => r.status === "present").length}
                        </p>
                        <p className="text-sm text-gray-600">Present Today</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {attendanceRecords.filter((r) => r.status === "late").length}
                        </p>
                        <p className="text-sm text-gray-600">Late Arrivals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {attendanceRecords.filter((r) => r.status === "absent").length}
                        </p>
                        <p className="text-sm text-gray-600">Absent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Attendance Activity</h3>
                  <div className="space-y-3">
                    {attendanceRecords.slice(0, 10).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(record.status)}
                          <div>
                            <p className="font-medium">
                              {record.user?.full_name} ({record.user?.student_id})
                            </p>
                            <p className="text-sm text-gray-600">
                              {record.user?.department} - Year {record.user?.year}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(record.status)}
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(record.date)} at {formatTime(record.check_in_time)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              {attendanceRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">{formatDate(record.date)}</p>
                          {isToday(record.date) && <p className="text-xs text-blue-600">Today</p>}
                        </div>
                        <div>
                          <p className="font-medium">
                            {record.user?.full_name} ({record.user?.student_id})
                          </p>
                          <p className="text-sm text-gray-600">
                            {record.user?.department} - Year {record.user?.year}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          {getStatusBadge(record.status)}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>In: {formatTime(record.check_in_time)}</p>
                        {record.check_out_time && <p>Out: {formatTime(record.check_out_time)}</p>}
                        {record.location && (
                          <p className="flex items-center gap-1 justify-end">
                            <MapPin className="h-3 w-3" />
                            {record.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}

        {/* Mark Attendance Dialog */}
        <MarkAttendanceDialog
          open={markAttendanceDialogOpen}
          onOpenChange={setMarkAttendanceDialogOpen}
          userId={user.id}
          onSuccess={() => window.location.reload()}
        />
      </div>
    </DashboardLayout>
  )
}
