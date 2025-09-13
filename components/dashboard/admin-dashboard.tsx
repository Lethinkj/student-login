import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "./dashboard-layout"
import { Users, BookOpen, UtensilsCrossed, BarChart3, Settings, Bell, Shield } from "lucide-react"
import Link from "next/link"

interface AdminDashboardProps {
  user: {
    id: string
    full_name: string
    role: string
    email: string
    department: string
  }
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <DashboardLayout user={user} activeTab="dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-purple-100">Welcome, {user.full_name} • System Administrator</p>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canteen Orders</CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98%</div>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription>Important system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Database Backup Failed</p>
                  <p className="text-xs text-gray-600">Automatic backup at 2:00 AM</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive" className="text-xs">
                    Critical
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">High Server Load</p>
                  <p className="text-xs text-gray-600">CPU usage at 85%</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    Warning
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">30 min ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">New User Registrations</p>
                  <p className="text-xs text-gray-600">12 pending approvals</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    Info
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                View System Logs
              </Button>
            </CardContent>
          </Card>

          {/* Admin Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Admin Tools
              </CardTitle>
              <CardDescription>System management and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/users">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <Users className="h-5 w-5" />
                    <span className="text-xs">User Management</span>
                  </Button>
                </Link>

                <Link href="/canteen">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <UtensilsCrossed className="h-5 w-5" />
                    <span className="text-xs">Canteen Management</span>
                  </Button>
                </Link>

                <Link href="/announcements">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <Bell className="h-5 w-5" />
                    <span className="text-xs">Announcements</span>
                  </Button>
                </Link>

                <Link href="/attendance">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2 bg-transparent">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-xs">Analytics</span>
                  </Button>
                </Link>
              </div>

              {/* Recent Activity */}
              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-green-50 rounded text-xs">
                    <p className="font-medium">New Faculty Registration</p>
                    <p className="text-gray-600">Dr. Sarah Johnson - Mathematics</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded text-xs">
                    <p className="font-medium">Canteen Menu Updated</p>
                    <p className="text-gray-600">8 new items added</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded text-xs">
                    <p className="font-medium">System Maintenance</p>
                    <p className="text-gray-600">Scheduled for this weekend</p>
                  </div>
                </div>
                <Button variant="link" className="text-xs p-0 h-auto mt-2">
                  View full activity log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
