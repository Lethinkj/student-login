"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"

interface CanteenItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  available: boolean
}

interface MenuItemCardProps {
  item: CanteenItem
  onAddToCart: (item: CanteenItem) => void
  isAdmin: boolean
}

export function MenuItemCard({ item, onAddToCart, isAdmin }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
        {item.image_url ? (
          <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-4xl">🍽️</div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">${item.price.toFixed(2)}</span>
          {isAdmin ? (
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <Button onClick={() => onAddToCart(item)} size="sm" disabled={!item.available}>
              <Plus className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          )}
        </div>
        {!item.available && (
          <Badge variant="destructive" className="mt-2 text-xs">
            Out of Stock
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
