"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  due_date: string
}

interface Submission {
  id: string
  assignment_id: string
  submission_text: string
  file_url: string
  status: string
}

interface SubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: Assignment | null
  existingSubmission: Submission | null
  userId: string
  onSuccess: () => void
}

export function SubmissionDialog({
  open,
  onOpenChange,
  assignment,
  existingSubmission,
  userId,
  onSuccess,
}: SubmissionDialogProps) {
  const [submissionText, setSubmissionText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (existingSubmission) {
      setSubmissionText(existingSubmission.submission_text || "")
    } else {
      setSubmissionText("")
    }
  }, [existingSubmission])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignment) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (existingSubmission) {
        // Update existing submission
        const { error } = await supabase
          .from("assignment_submissions")
          .update({
            submission_text: submissionText,
            status: "submitted",
          })
          .eq("id", existingSubmission.id)

        if (error) throw error
      } else {
        // Create new submission
        const { error } = await supabase.from("assignment_submissions").insert({
          assignment_id: assignment.id,
          student_id: userId,
          submission_text: submissionText,
          status: "submitted",
        })

        if (error) throw error
      }

      setSubmissionText("")
      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!assignment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{existingSubmission ? "Edit Submission" : "Submit Assignment"}</DialogTitle>
          <DialogDescription>
            {assignment.title} - {assignment.subject}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Assignment Description:</h4>
            <p className="text-sm text-gray-600">{assignment.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              Due:{" "}
              {new Date(assignment.due_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="submission">Your Submission</Label>
              <Textarea
                id="submission"
                placeholder="Enter your assignment submission here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={8}
                required
              />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : existingSubmission ? "Update Submission" : "Submit Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
