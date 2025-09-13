import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CanteenView } from "@/components/canteen/canteen-view"

export default async function CanteenPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (profileError || !userProfile) {
    redirect("/auth/login")
  }

  // Get canteen items
  const { data: canteenItems, error: itemsError } = await supabase
    .from("canteen_items")
    .select("*")
    .eq("available", true)
    .order("category", { ascending: true })

  if (itemsError) {
    console.error("Error fetching canteen items:", itemsError)
  }

  // Get user's orders
  const { data: userOrders, error: ordersError } = await supabase
    .from("canteen_orders")
    .select("*")
    .eq("user_id", userProfile.id)
    .order("order_date", { ascending: false })
    .limit(10)

  if (ordersError) {
    console.error("Error fetching user orders:", ordersError)
  }

  // Get all orders if admin
  let allOrders = []
  if (userProfile.role === "admin") {
    const { data: allOrdersData, error: allOrdersError } = await supabase
      .from("canteen_orders")
      .select(`
        *,
        user:users (
          full_name,
          student_id
        )
      `)
      .order("order_date", { ascending: false })
      .limit(50)

    if (allOrdersError) {
      console.error("Error fetching all orders:", allOrdersError)
    } else {
      allOrders = allOrdersData || []
    }
  }

  return (
    <CanteenView
      user={userProfile}
      canteenItems={canteenItems || []}
      userOrders={userOrders || []}
      allOrders={allOrders}
    />
  )
}
