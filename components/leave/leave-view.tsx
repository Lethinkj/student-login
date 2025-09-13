"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import { CreateLeaveRequestDialog } from "./create-leave-request-dialog"
import { ApproveLeaveDialog } from "./approve-leave-dialog"

interface LeaveRequest {
  id: string
  user_id: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
  approved_by: string
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    student_id: string
    department: string
    year: number
  }
  approved_by_user?: {
    full_name: string
  }
}

interface LeaveViewProps {
  user: {
    id: string
    full_name: string
    role: string
    email: string
  }
  leaveRequests: LeaveRequest[]
}

export function LeaveView({ user, leaveRequests }: LeaveViewProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const handleApproveRequest = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setApproveDialogOpen(true)
  }

  return (
    <DashboardLayout user={user} activeTab="leave">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === "student" ? "Leave Requests" : "Leave Management"}
            </h1>
            <p className="text-gray-600">
              {user.role === "student"
                ? "Submit and track your leave requests"
                : "Review and approve student leave requests"}
            </p>
          </div>
          {user.role === "student" && (
            <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Request Leave
            </Button>
          )}
        </div>

        {user.role === "student" ? (
          /* Student View */
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{leaveRequests.length}</p>
                      <p className="text-sm text-gray-600">Total Requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">{leaveRequests.filter((r) => r.status === "pending").length}</p>
                      <p className="text-sm text-gray-600">Pending</p>
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
                        {leaveRequests.filter((r) => r.status === "approved").length}
                      </p>
                      <p className="text-sm text-gray-600">Approved</p>
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
                        {leaveRequests.filter((r) => r.status === "rejected").length}
                      </p>
                      <p className="text-sm text-gray-600">Rejected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leave Requests List */}
            <div className="space-y-4">
              {leaveRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold capitalize">{request.leave_type} Leave</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-600 mb-3">{request.reason}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(request.start_date)} - {formatDate(request.end_date)}
                          </span>
                          <span>{calculateDays(request.start_date, request.end_date)} days</span>
                          <span>Requested: {formatDate(request.created_at)}</span>
                        </div>
                        {request.approved_by_user && (
                          <p className="text-sm text-gray-500 mt-2">
                            {request.status === "approved" ? "Approved" : "Reviewed"} by:{" "}
                            {request.approved_by_user.full_name}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex items-center">{getStatusIcon(request.status)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {leaveRequests.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No leave requests yet. Click "Request Leave" to get started.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* Faculty/Admin View */
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">Pending Requests</TabsTrigger>
              <TabsTrigger value="all">All Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {leaveRequests
                .filter((r) => r.status === "pending")
                .map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold capitalize">{request.leave_type} Leave</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-gray-600 mb-2">
                            Student: {request.user?.full_name} ({request.user?.student_id})
                          </p>
                          <p className="text-gray-600 mb-3">{request.reason}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(request.start_date)} - {formatDate(request.end_date)}
                            </span>
                            <span>{calculateDays(request.start_date, request.end_date)} days</span>
                            <span>Requested: {formatDate(request.created_at)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button onClick={() => handleApproveRequest(request)}>Review</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {leaveRequests.filter((r) => r.status === "pending").length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No pending leave requests.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {leaveRequests.filter((r) => r.status === "pending").length}
                        </p>
                        <p className="text-sm text-gray-600">Pending</p>
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
                          {leaveRequests.filter((r) => r.status === "approved").length}
                        </p>
                        <p className="text-sm text-gray-600">Approved</p>
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
                          {leaveRequests.filter((r) => r.status === "rejected").length}
                        </p>
                        <p className="text-sm text-gray-600">Rejected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {leaveRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold capitalize">{request.leave_type} Leave</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-600 mb-2">
                          Student: {request.user?.full_name} ({request.user?.student_id})
                        </p>
                        <p className="text-gray-600 mb-3">{request.reason}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(request.start_date)} - {formatDate(request.end_date)}
                          </span>
                          <span>{calculateDays(request.start_date, request.end_date)} days</span>
                          <span>Requested: {formatDate(request.created_at)}</span>
                        </div>
                        {request.approved_by_user && (
                          <p className="text-sm text-gray-500 mt-2">
                            {request.status === "approved" ? "Approved" : "Reviewed"} by:{" "}
                            {request.approved_by_user.full_name}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex items-center">
                        {request.status === "pending" && (
                          <Button onClick={() => handleApproveRequest(request)}>Review</Button>
                        )}
                        {request.status !== "pending" && getStatusIcon(request.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}

        {/* Dialogs */}
        <CreateLeaveRequestDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          userId={user.id}
          onSuccess={() => window.location.reload()}
        />

        <ApproveLeaveDialog
          open={approveDialogOpen}
          onOpenChange={setApproveDialogOpen}
          request={selectedRequest}
          approverId={user.id}
          onSuccess={() => window.location.reload()}
        />
      </div>
    </DashboardLayout>
  )
}
