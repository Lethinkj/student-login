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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

interface MarkAttendanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess: () => void
}

export function MarkAttendanceDialog({ open, onOpenChange, userId, onSuccess }: MarkAttendanceDialogProps) {
  const [formData, setFormData] = useState({
    status: "present",
    location: "",
  })
  const [currentTime, setCurrentTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const statusOptions = [
    { value: "present", label: "Present" },
    { value: "late", label: "Late" },
  ]

  useEffect(() => {
    // Update current time every second
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Get user's location
  useEffect(() => {
    if (open && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev) => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }))
        },
        (error) => {
          console.log("Location access denied:", error)
          setFormData((prev) => ({ ...prev, location: "Location not available" }))
        },
      )
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const now = new Date()
      const today = now.toISOString().split("T")[0]

      // Check if attendance already marked today
      const { data: existingRecord, error: checkError } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError
      }

      if (existingRecord) {
        setError("You have already marked attendance for today")
        setIsLoading(false)
        return
      }

      // Determine if late (assuming 9:00 AM is the cutoff)
      const cutoffTime = new Date()
      cutoffTime.setHours(9, 0, 0, 0)
      const isLate = now > cutoffTime

      const attendanceData = {
        user_id: userId,
        date: today,
        status: isLate && formData.status === "present" ? "late" : formData.status,
        check_in_time: now.toISOString(),
        location: formData.location,
      }

      const { error } = await supabase.from("attendance").insert(attendanceData)

      if (error) throw error

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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>Mark your attendance for today</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Current Time</p>
            <p className="text-2xl font-bold text-blue-600">{currentTime}</p>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Location will be detected automatically"
                readOnly
              />
              <p className="text-xs text-gray-500">Location is automatically detected for attendance verification</p>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Marking..." : "Mark Attendance"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
