"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UtensilsCrossed, Plus, ShoppingCart, Clock, CheckCircle, Settings } from "lucide-react"
import { useState } from "react"
import { MenuItemCard } from "./menu-item-card"
import { CartDialog } from "./cart-dialog"
import { AddItemDialog } from "./add-item-dialog"
import { OrderStatusDialog } from "./order-status-dialog"

interface CanteenItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  available: boolean
}

interface Order {
  id: string
  user_id: string
  items: any
  total_amount: number
  status: string
  order_date: string
  pickup_time: string
  user?: {
    full_name: string
    student_id: string
  }
}

interface CanteenViewProps {
  user: {
    id: string
    full_name: string
    role: string
    email: string
  }
  canteenItems: CanteenItem[]
  userOrders: Order[]
  allOrders: Order[]
}

interface CartItem {
  item: CanteenItem
  quantity: number
}

export function CanteenView({ user, canteenItems, userOrders, allOrders }: CanteenViewProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartDialogOpen, setCartDialogOpen] = useState(false)
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false)
  const [orderStatusDialogOpen, setOrderStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Group items by category
  const itemsByCategory = canteenItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, CanteenItem[]>,
  )

  const addToCart = (item: CanteenItem) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.item.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((cartItem) => cartItem.item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prev) => prev.map((cartItem) => (cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem)))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "preparing":
        return <Badge className="bg-blue-100 text-blue-800">Preparing</Badge>
      case "ready":
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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

  const handleUpdateOrderStatus = (order: Order) => {
    setSelectedOrder(order)
    setOrderStatusDialogOpen(true)
  }

  return (
    <DashboardLayout user={user} activeTab="canteen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Canteen</h1>
            <p className="text-gray-600">
              {user.role === "admin" ? "Manage menu items and orders" : "Order delicious food from our canteen"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user.role !== "admin" && cart.length > 0 && (
              <Button onClick={() => setCartDialogOpen(true)} className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart ({cart.length}) - ${getTotalAmount().toFixed(2)}
              </Button>
            )}
            {user.role === "admin" && (
              <Button onClick={() => setAddItemDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Menu Item
              </Button>
            )}
          </div>
        </div>

        {user.role === "admin" ? (
          /* Admin View */
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders">Orders Management</TabsTrigger>
              <TabsTrigger value="menu">Menu Management</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              {/* Order Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">{allOrders.filter((o) => o.status === "pending").length}</p>
                        <p className="text-sm text-gray-600">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{allOrders.filter((o) => o.status === "preparing").length}</p>
                        <p className="text-sm text-gray-600">Preparing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">{allOrders.filter((o) => o.status === "ready").length}</p>
                        <p className="text-sm text-gray-600">Ready</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-2xl font-bold">{allOrders.length}</p>
                        <p className="text-sm text-gray-600">Total Orders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {allOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">Order #{order.id.slice(-8)}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-gray-600 mb-2">
                            Customer: {order.user?.full_name} ({order.user?.student_id})
                          </p>
                          <div className="text-sm text-gray-500 mb-3">
                            <p>Ordered: {formatDate(order.order_date)}</p>
                            <p>Total: ${order.total_amount.toFixed(2)}</p>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium mb-1">Items:</p>
                            <div className="space-y-1">
                              {Array.isArray(order.items) &&
                                order.items.map((item: any, index: number) => (
                                  <p key={index} className="text-gray-600">
                                    {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                ))}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {order.status !== "completed" && order.status !== "cancelled" && (
                            <Button onClick={() => handleUpdateOrderStatus(order)}>Update Status</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="menu" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {canteenItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} isAdmin={true} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          /* Student/Faculty View */
          <Tabs defaultValue="menu" className="space-y-6">
            <TabsList>
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="space-y-6">
              {Object.entries(itemsByCategory).map(([category, items]) => (
                <div key={category}>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} isAdmin={false} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              {/* Order Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {userOrders.filter((o) => o.status === "pending" || o.status === "preparing").length}
                        </p>
                        <p className="text-sm text-gray-600">Active Orders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">{userOrders.filter((o) => o.status === "ready").length}</p>
                        <p className="text-sm text-gray-600">Ready for Pickup</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{userOrders.length}</p>
                        <p className="text-sm text-gray-600">Total Orders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">Order #{order.id.slice(-8)}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="text-sm text-gray-500 mb-3">
                            <p>Ordered: {formatDate(order.order_date)}</p>
                            <p>Total: ${order.total_amount.toFixed(2)}</p>
                            {order.pickup_time && <p>Pickup: {formatDate(order.pickup_time)}</p>}
                          </div>
                          <div className="text-sm">
                            <p className="font-medium mb-1">Items:</p>
                            <div className="space-y-1">
                              {Array.isArray(order.items) &&
                                order.items.map((item: any, index: number) => (
                                  <p key={index} className="text-gray-600">
                                    {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {userOrders.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No orders yet. Start by browsing our menu!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Dialogs */}
        <CartDialog
          open={cartDialogOpen}
          onOpenChange={setCartDialogOpen}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          userId={user.id}
          onSuccess={() => {
            setCart([])
            window.location.reload()
          }}
        />

        <AddItemDialog
          open={addItemDialogOpen}
          onOpenChange={setAddItemDialogOpen}
          onSuccess={() => window.location.reload()}
        />

        <OrderStatusDialog
          open={orderStatusDialogOpen}
          onOpenChange={setOrderStatusDialogOpen}
          order={selectedOrder}
          onSuccess={() => window.location.reload()}
        />
      </div>
    </DashboardLayout>
  )
}
