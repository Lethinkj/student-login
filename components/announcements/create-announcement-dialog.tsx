"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

interface CreateAnnouncementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess: () => void
}

export function CreateAnnouncementDialog({ open, onOpenChange, userId, onSuccess }: CreateAnnouncementDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal",
    targetAudience: [] as string[],
    expiresAt: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const priorities = [
    { value: "low", label: "Low Priority" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent" },
  ]

  const audiences = [
    { value: "student", label: "Students" },
    { value: "faculty", label: "Faculty" },
    { value: "admin", label: "Admin" },
  ]

  const handleAudienceChange = (audience: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, targetAudience: [...formData.targetAudience, audience] })
    } else {
      setFormData({ ...formData, targetAudience: formData.targetAudience.filter((a) => a !== audience) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.targetAudience.length === 0) {
      setError("Please select at least one target audience")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const announcementData: any = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        target_audience: formData.targetAudience,
        created_by: userId,
      }

      if (formData.expiresAt) {
        announcementData.expires_at = new Date(formData.expiresAt).toISOString()
      }

      const { error } = await supabase.from("announcements").insert(announcementData)

      if (error) throw error

      // Reset form
      setFormData({
        title: "",
        content: "",
        priority: "normal",
        targetAudience: [],
        expiresAt: "",
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogDescription>Create a new announcement for students and faculty</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Library Hours Extended"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your announcement content here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expires At (Optional)</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Audience</Label>
            <div className="flex gap-4">
              {audiences.map((audience) => (
                <div key={audience.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={audience.value}
                    checked={formData.targetAudience.includes(audience.value)}
                    onCheckedChange={(checked) => handleAudienceChange(audience.value, checked as boolean)}
                  />
                  <Label htmlFor={audience.value} className="text-sm font-normal">
                    {audience.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
