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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

interface Submission {
  id: string
  assignment_id: string
  submission_text: string
  grade: number
  feedback: string
  status: string
  student?: {
    full_name: string
    student_id: string
  }
  assignment?: {
    title: string
    subject: string
  }
}

interface GradeSubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submission: Submission | null
  onSuccess: () => void
}

export function GradeSubmissionDialog({ open, onOpenChange, submission, onSuccess }: GradeSubmissionDialogProps) {
  const [grade, setGrade] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (submission) {
      setGrade(submission.grade?.toString() || "")
      setFeedback(submission.feedback || "")
    } else {
      setGrade("")
      setFeedback("")
    }
  }, [submission])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!submission) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("assignment_submissions")
        .update({
          grade: Number.parseInt(grade),
          feedback: feedback,
          status: "graded",
          graded_at: new Date().toISOString(),
        })
        .eq("id", submission.id)

      if (error) throw error

      setGrade("")
      setFeedback("")
      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!submission) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
          <DialogDescription>
            {submission.assignment?.title} - {submission.student?.full_name} ({submission.student?.student_id})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Student Submission:</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{submission.submission_text}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade (0-100)</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max="100"
                placeholder="Enter grade out of 100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Provide feedback to the student..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Grade"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
