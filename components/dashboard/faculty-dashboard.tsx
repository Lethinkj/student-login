import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "./dashboard-layout"
import { BookOpen, Users, Calendar, FileText, Clock, Bell } from "lucide-react"
import Link from "next/link"

interface FacultyDashboardProps {
  user: {
    id: string
    full_name: string
    role: string
    email: string
    department: string
  }
}

export function FacultyDashboard({ user }: FacultyDashboardProps) {
  return (
    <DashboardLayout user={user} activeTab="dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome, Professor {user.full_name}</h1>
          <p className="text-green-100">{user.department} Department</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">Across 3 courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Submissions to grade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Pending approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Submissions
              </CardTitle>
              <CardDescription>Latest student submissions requiring review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Data Structures Project</p>
                  <p className="text-xs text-gray-600">John Smith - CS301</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Algorithm Analysis</p>
                  <p className="text-xs text-gray-600">Sarah Johnson - CS301</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    Review
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Database Design</p>
                  <p className="text-xs text-gray-600">Mike Davis - CS302</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    New
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>

              <Link href="/assignments">
                <Button variant="outline" className="w-full bg-transparent">
                  Review All Submissions
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Faculty Tools & Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Faculty Tools
              </CardTitle>
              <CardDescription>Manage your courses and students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/assignments">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-xs">Create Assignment</span>
                  </Button>
                </Link>

                <Link href="/students">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <Users className="h-5 w-5" />
                    <span className="text-xs">View Students</span>
                  </Button>
                </Link>

                <Link href="/attendance">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <Clock className="h-5 w-5" />
                    <span className="text-xs">Take Attendance</span>
                  </Button>
                </Link>

                <Link href="/announcements">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <Bell className="h-5 w-5" />
                    <span className="text-xs">Post Announcement</span>
                  </Button>
                </Link>
              </div>

              {/* Pending Leave Requests */}
              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-3">Pending Leave Requests</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-yellow-50 rounded text-xs">
                    <p className="font-medium">Emma Wilson - Sick Leave</p>
                    <p className="text-gray-600">March 15-17, 2024</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded text-xs">
                    <p className="font-medium">Alex Chen - Personal Leave</p>
                    <p className="text-gray-600">March 20, 2024</p>
                  </div>
                </div>
                <Link href="/leave">
                  <Button variant="link" className="text-xs p-0 h-auto mt-2">
                    Review all requests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
