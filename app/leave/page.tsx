import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LeaveView } from "@/components/leave/leave-view"

export default async function LeavePage() {
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

  // Get leave requests based on user role
  let leaveRequests = []
  if (userProfile.role === "student") {
    const { data: userLeaveRequests, error: leaveError } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("user_id", userProfile.id)
      .order("created_at", { ascending: false })

    if (leaveError) {
      console.error("Error fetching leave requests:", leaveError)
    } else {
      leaveRequests = userLeaveRequests || []
    }
  } else {
    // Faculty and admin can see all leave requests
    const { data: allLeaveRequests, error: leaveError } = await supabase
      .from("leave_requests")
      .select(`
        *,
        user:users (
          full_name,
          student_id,
          department,
          year
        ),
        approved_by_user:users!leave_requests_approved_by_fkey (
          full_name
        )
      `)
      .order("created_at", { ascending: false })

    if (leaveError) {
      console.error("Error fetching all leave requests:", leaveError)
    } else {
      leaveRequests = allLeaveRequests || []
    }
  }

  return <LeaveView user={userProfile} leaveRequests={leaveRequests} />
}
