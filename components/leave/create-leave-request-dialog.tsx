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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface CreateLeaveRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess: () => void
}

export function CreateLeaveRequestDialog({ open, onOpenChange, userId, onSuccess }: CreateLeaveRequestDialogProps) {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const leaveTypes = [
    { value: "sick", label: "Sick Leave" },
    { value: "personal", label: "Personal Leave" },
    { value: "emergency", label: "Emergency Leave" },
    { value: "vacation", label: "Vacation Leave" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate dates
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      setError("Start date cannot be in the past")
      setIsLoading(false)
      return
    }

    if (endDate < startDate) {
      setError("End date cannot be before start date")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase.from("leave_requests").insert({
        user_id: userId,
        leave_type: formData.leaveType,
        start_date: formData.startDate,
        end_date: formData.endDate,
        reason: formData.reason,
        status: "pending",
      })

      if (error) throw error

      // Reset form
      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>Submit a new leave request for approval</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select
              value={formData.leaveType}
              onValueChange={(value) => setFormData({ ...formData, leaveType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your leave request..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
              required
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
