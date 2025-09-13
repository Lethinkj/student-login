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
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface CanteenItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  available: boolean
}

interface CartItem {
  item: CanteenItem
  quantity: number
}

interface CartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  userId: string
  onSuccess: () => void
}

export function CartDialog({
  open,
  onOpenChange,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  userId,
  onSuccess,
}: CartDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getTotalAmount = () => {
    return cart.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0)
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const orderItems = cart.map((cartItem) => ({
        id: cartItem.item.id,
        name: cartItem.item.name,
        price: cartItem.item.price,
        quantity: cartItem.quantity,
      }))

      const { error } = await supabase.from("canteen_orders").insert({
        user_id: userId,
        items: orderItems,
        total_amount: getTotalAmount(),
        status: "pending",
      })

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Your Cart</DialogTitle>
          <DialogDescription>Review your order before placing it</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            cart.map((cartItem) => (
              <div key={cartItem.item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{cartItem.item.name}</h4>
                  <p className="text-sm text-gray-600">${cartItem.item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={cartItem.quantity}
                    onChange={(e) => onUpdateQuantity(cartItem.item.id, Number.parseInt(e.target.value) || 1)}
                    className="w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onRemoveItem(cartItem.item.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>${getTotalAmount().toFixed(2)}</span>
            </div>
          </div>
        )}

        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Continue Shopping
          </Button>
          <Button onClick={handlePlaceOrder} disabled={cart.length === 0 || isLoading}>
            {isLoading ? "Placing Order..." : "Place Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
