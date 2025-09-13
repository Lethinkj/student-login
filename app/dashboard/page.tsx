import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { FacultyDashboard } from "@/components/dashboard/faculty-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile with role
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (profileError || !userProfile) {
    redirect("/auth/login")
  }

  // Render dashboard based on user role
  switch (userProfile.role) {
    case "student":
      return <StudentDashboard user={userProfile} />
    case "faculty":
      return <FacultyDashboard user={userProfile} />
    case "admin":
      return <AdminDashboard user={userProfile} />
    default:
      redirect("/auth/login")
  }
}
