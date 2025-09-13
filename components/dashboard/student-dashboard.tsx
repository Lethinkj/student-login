import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "./dashboard-layout"
import { BookOpen, Calendar, Trophy, UtensilsCrossed, FileText, Clock } from "lucide-react"
import Link from "next/link"

interface StudentDashboardProps {
  user: {
    id: string
    full_name: string
    role: string
    email: string
    student_id: string
    department: string
    year: number
  }
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  return (
    <DashboardLayout user={user} activeTab="dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user.full_name}!</h1>
          <p className="text-blue-100">
            {user.student_id} • {user.department} • Year {user.year}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#12</div>
              <p className="text-xs text-muted-foreground">850 points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Ready for pickup</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Upcoming Assignments
              </CardTitle>
              <CardDescription>Your pending assignments and deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Data Structures Project</p>
                  <p className="text-xs text-gray-600">Computer Science</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive" className="text-xs">
                    Due Tomorrow
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">11:59 PM</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Math Quiz 3</p>
                  <p className="text-xs text-gray-600">Mathematics</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    Due in 3 days
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">2:00 PM</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">History Essay</p>
                  <p className="text-xs text-gray-600">History</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    Due in 1 week
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">11:59 PM</p>
                </div>
              </div>

              <Link href="/assignments">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Assignments
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Notes & Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/notes">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">My Notes</span>
                  </Button>
                </Link>

                <Link href="/canteen">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <UtensilsCrossed className="h-5 w-5" />
                    <span className="text-xs">Order Food</span>
                  </Button>
                </Link>

                <Link href="/leave">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs">Request Leave</span>
                  </Button>
                </Link>

                <Link href="/attendance">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <Clock className="h-5 w-5" />
                    <span className="text-xs">Check In</span>
                  </Button>
                </Link>
              </div>

              {/* Recent Announcements */}
              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-3">Recent Announcements</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded text-xs">
                    <p className="font-medium">Library Hours Extended</p>
                    <p className="text-gray-600">Open until 10 PM during finals week</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded text-xs">
                    <p className="font-medium">New Course Registration</p>
                    <p className="text-gray-600">Spring semester registration opens Monday</p>
                  </div>
                </div>
                <Link href="/announcements">
                  <Button variant="link" className="text-xs p-0 h-auto mt-2">
                    View all announcements
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
