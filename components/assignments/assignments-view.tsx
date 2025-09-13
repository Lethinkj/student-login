"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { BookOpen, Plus, Clock, CheckCircle, AlertCircle, FileText, Calendar } from "lucide-react"
import { useState } from "react"
import { CreateAssignmentDialog } from "./create-assignment-dialog"
import { SubmissionDialog } from "./submission-dialog"
import { GradeSubmissionDialog } from "./grade-submission-dialog"

interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  due_date: string
  created_at: string
  created_by_user: {
    full_name: string
    department: string
  }
}

interface Submission {
  id: string
  assignment_id: string
  student_id: string
  submission_text: string
  file_url: string
  status: string
  grade: number
  feedback: string
  submitted_at: string
  graded_at: string
  student?: {
    full_name: string
    student_id: string
    department: string
    year: number
  }
  assignment?: {
    title: string
    subject: string
  }
}

interface AssignmentsViewProps {
  user: {
    id: string
    full_name: string
    role: string
    email: string
  }
  assignments: Assignment[]
  userSubmissions: Submission[]
  allSubmissions: Submission[]
}

export function AssignmentsView({ user, assignments, userSubmissions, allSubmissions }: AssignmentsViewProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false)
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  const getSubmissionStatus = (assignmentId: string) => {
    const submission = userSubmissions.find((sub) => sub.assignment_id === assignmentId)
    return submission || null
  }

  const getStatusBadge = (assignment: Assignment) => {
    const submission = getSubmissionStatus(assignment.id)
    const dueDate = new Date(assignment.due_date)
    const now = new Date()

    if (submission) {
      switch (submission.status) {
        case "submitted":
          return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>
        case "graded":
          return <Badge className="bg-green-100 text-green-800">Graded</Badge>
        default:
          return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      }
    }

    if (dueDate < now) {
      return <Badge variant="destructive">Overdue</Badge>
    }

    const timeDiff = dueDate.getTime() - now.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    if (daysDiff <= 1) {
      return <Badge className="bg-orange-100 text-orange-800">Due Soon</Badge>
    }

    return <Badge variant="outline">Pending</Badge>
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

  const handleSubmitAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setSubmissionDialogOpen(true)
  }

  const handleGradeSubmission = (submission: Submission) => {
    setSelectedSubmission(submission)
    setGradeDialogOpen(true)
  }

  return (
    <DashboardLayout user={user} activeTab="assignments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600">
              {user.role === "student"
                ? "View and submit your assignments"
                : "Manage assignments and review submissions"}
            </p>
          </div>
          {(user.role === "faculty" || user.role === "admin") && (
            <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Assignment
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
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{assignments.length}</p>
                      <p className="text-sm text-gray-600">Total Assignments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {assignments.filter((a) => !getSubmissionStatus(a.id)).length}
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
                        {userSubmissions.filter((s) => s.status === "submitted" || s.status === "graded").length}
                      </p>
                      <p className="text-sm text-gray-600">Submitted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {
                          assignments.filter((a) => {
                            const submission = getSubmissionStatus(a.id)
                            return !submission && new Date(a.due_date) < new Date()
                          }).length
                        }
                      </p>
                      <p className="text-sm text-gray-600">Overdue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
              {assignments.map((assignment) => {
                const submission = getSubmissionStatus(assignment.id)
                return (
                  <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                            {getStatusBadge(assignment)}
                          </div>
                          <p className="text-gray-600 mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {assignment.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {formatDate(assignment.due_date)}
                            </span>
                            <span>By: {assignment.created_by_user.full_name}</span>
                          </div>
                          {submission && submission.status === "graded" && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-800">
                                  Grade: {submission.grade}/100
                                </span>
                                <span className="text-xs text-green-600">
                                  Graded on {formatDate(submission.graded_at)}
                                </span>
                              </div>
                              {submission.feedback && (
                                <p className="text-sm text-green-700 mt-1">{submission.feedback}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          {!submission && new Date(assignment.due_date) > new Date() && (
                            <Button onClick={() => handleSubmitAssignment(assignment)}>Submit</Button>
                          )}
                          {submission && submission.status === "pending" && (
                            <Button variant="outline" onClick={() => handleSubmitAssignment(assignment)}>
                              Edit Submission
                            </Button>
                          )}
                          {submission && submission.status === "submitted" && (
                            <Badge className="bg-blue-100 text-blue-800">Awaiting Grade</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          /* Faculty/Admin View */
          <Tabs defaultValue="assignments" className="space-y-6">
            <TabsList>
              <TabsTrigger value="assignments">My Assignments</TabsTrigger>
              <TabsTrigger value="submissions">All Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments" className="space-y-4">
              {assignments
                .filter((a) => user.role === "admin" || a.created_by === user.id)
                .map((assignment) => (
                  <Card key={assignment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>
                          <p className="text-gray-600 mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{assignment.subject}</span>
                            <span>Due: {formatDate(assignment.due_date)}</span>
                            <span>Created: {formatDate(assignment.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {allSubmissions.filter((s) => s.assignment_id === assignment.id).length} submissions
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="submissions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{allSubmissions.length}</p>
                        <p className="text-sm text-gray-600">Total Submissions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {allSubmissions.filter((s) => s.status === "submitted").length}
                        </p>
                        <p className="text-sm text-gray-600">Pending Review</p>
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
                          {allSubmissions.filter((s) => s.status === "graded").length}
                        </p>
                        <p className="text-sm text-gray-600">Graded</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {allSubmissions.map((submission) => (
                <Card key={submission.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{submission.assignment?.title}</h3>
                          <Badge
                            className={
                              submission.status === "graded"
                                ? "bg-green-100 text-green-800"
                                : submission.status === "submitted"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {submission.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">
                          Student: {submission.student?.full_name} ({submission.student?.student_id})
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{submission.assignment?.subject}</span>
                          <span>Submitted: {formatDate(submission.submitted_at)}</span>
                          {submission.graded_at && <span>Graded: {formatDate(submission.graded_at)}</span>}
                        </div>
                        {submission.status === "graded" && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-green-800">Grade: {submission.grade}/100</p>
                            {submission.feedback && (
                              <p className="text-sm text-green-700 mt-1">{submission.feedback}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {submission.status === "submitted" && (
                          <Button onClick={() => handleGradeSubmission(submission)}>Grade</Button>
                        )}
                        {submission.status === "graded" && (
                          <Button variant="outline" onClick={() => handleGradeSubmission(submission)}>
                            Edit Grade
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}

        {/* Dialogs */}
        <CreateAssignmentDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          userId={user.id}
          onSuccess={() => window.location.reload()}
        />

        <SubmissionDialog
          open={submissionDialogOpen}
          onOpenChange={setSubmissionDialogOpen}
          assignment={selectedAssignment}
          existingSubmission={selectedAssignment ? getSubmissionStatus(selectedAssignment.id) : null}
          userId={user.id}
          onSuccess={() => window.location.reload()}
        />

        <GradeSubmissionDialog
          open={gradeDialogOpen}
          onOpenChange={setGradeDialogOpen}
          submission={selectedSubmission}
          onSuccess={() => window.location.reload()}
        />
      </div>
    </DashboardLayout>
  )
}
