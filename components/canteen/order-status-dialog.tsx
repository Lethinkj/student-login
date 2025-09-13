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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

interface Order {
  id: string
  status: string
  user?: {
    full_name: string
    student_id: string
  }
}

interface OrderStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onSuccess: () => void
}

export function OrderStatusDialog({ open, onOpenChange, order, onSuccess }: OrderStatusDialogProps) {
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready for Pickup" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  useEffect(() => {
    if (order) {
      setStatus(order.status)
    }
  }, [order])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const updateData: any = { status }

      // Set pickup time when status changes to ready
      if (status === "ready" && order.status !== "ready") {
        updateData.pickup_time = new Date().toISOString()
      }

      const { error } = await supabase.from("canteen_orders").update(updateData).eq("id", order.id)

      if (error) throw error

      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Order #{order.id.slice(-8)} - {order.user?.full_name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Order Status
            </label>
            <Select value={status} onValueChange={setStatus}>
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

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
