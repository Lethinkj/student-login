"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Bell, Plus, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { useState } from "react"
import { CreateAnnouncementDialog } from "./create-announcement-dialog"

interface Announcement {
  id: string
  title: string
  content: string
  priority: string
  target_audience: string[]
  created_at: string
  expires_at: string
  created_by_user: {
    full_name: string
    department: string
  }
}

interface AnnouncementsViewProps {
  user: {
    id: string
    full_name: string
    role: string
    email: string
  }
  announcements: Announcement[]
}

export function AnnouncementsView({ user, announcements }: AnnouncementsViewProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High Priority</Badge>
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low Priority</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "normal":
        return <Info className="h-5 w-5 text-blue-600" />
      case "low":
        return <CheckCircle className="h-5 w-5 text-gray-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isExpired = (expiresAt: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  // Filter out expired announcements for students
  const visibleAnnouncements =
    user.role === "student" ? announcements.filter((a) => !isExpired(a.expires_at)) : announcements

  // Sort by priority and date
  const sortedAnnouncements = visibleAnnouncements.sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0

    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <DashboardLayout user={user} activeTab="announcements">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600">
              {user.role === "student" || user.role === "faculty"
                ? "Stay updated with the latest news and information"
                : "Manage and create announcements for students and faculty"}
            </p>
          </div>
          {(user.role === "faculty" || user.role === "admin") && (
            <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Announcement
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{visibleAnnouncements.length}</p>
                  <p className="text-sm text-gray-600">Total Announcements</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {visibleAnnouncements.filter((a) => a.priority === "urgent").length}
                  </p>
                  <p className="text-sm text-gray-600">Urgent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {visibleAnnouncements.filter((a) => a.priority === "high").length}
                  </p>
                  <p className="text-sm text-gray-600">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {visibleAnnouncements.filter((a) => a.priority === "normal").length}
                  </p>
                  <p className="text-sm text-gray-600">Normal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`${
                announcement.priority === "urgent"
                  ? "border-red-200 bg-red-50"
                  : announcement.priority === "high"
                    ? "border-orange-200 bg-orange-50"
                    : "hover:shadow-md transition-shadow"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getPriorityIcon(announcement.priority)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{announcement.title}</h3>
                      {getPriorityBadge(announcement.priority)}
                      {isExpired(announcement.expires_at) && user.role !== "student" && (
                        <Badge variant="outline" className="text-gray-500">
                          Expired
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By: {announcement.created_by_user.full_name}</span>
                      <span>Department: {announcement.created_by_user.department}</span>
                      <span>Posted: {formatDate(announcement.created_at)}</span>
                      {announcement.expires_at && (
                        <span>
                          {isExpired(announcement.expires_at) ? "Expired" : "Expires"}:{" "}
                          {formatDate(announcement.expires_at)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Target:</span>
                      {announcement.target_audience.map((audience) => (
                        <Badge key={audience} variant="secondary" className="text-xs capitalize">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {sortedAnnouncements.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No announcements available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Announcement Dialog */}
        <CreateAnnouncementDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          userId={user.id}
          onSuccess={() => window.location.reload()}
        />
      </div>
    </DashboardLayout>
  )
}
