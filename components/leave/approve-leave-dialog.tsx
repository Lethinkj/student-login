"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface LeaveRequest {
  id: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  user?: {
    full_name: string
    student_id: string
  }
}

interface ApproveLeaveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: LeaveRequest | null
  approverId: string
  onSuccess: () => void
}

export function ApproveLeaveDialog({ open, onOpenChange, request, approverId, onSuccess }: ApproveLeaveDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async (approved: boolean) => {
    if (!request) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("leave_requests")
        .update({
          status: approved ? "approved" : "rejected",
          approved_by: approverId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", request.id)

      if (error) throw error

      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!request) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review Leave Request</DialogTitle>
          <DialogDescription>
            {request.user?.full_name} ({request.user?.student_id}) - {request.leave_type} Leave
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div>
              <h4 className="font-medium text-sm text-gray-700">Leave Period:</h4>
              <p className="text-sm">
                {formatDate(request.start_date)} - {formatDate(request.end_date)}
              </p>
              <p className="text-xs text-gray-500">{calculateDays(request.start_date, request.end_date)} days</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-700">Reason:</h4>
              <p className="text-sm text-gray-600">{request.reason}</p>
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => handleApprove(false)} disabled={isLoading}>
            {isLoading ? "Processing..." : "Reject"}
          </Button>
          <Button onClick={() => handleApprove(true)} disabled={isLoading}>
            {isLoading ? "Processing..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
