import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AttendanceView } from "@/components/attendance/attendance-view"

export default async function AttendancePage() {
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

  // Get attendance records based on user role
  let attendanceRecords = []
  if (userProfile.role === "student") {
    const { data: userAttendance, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userProfile.id)
      .order("date", { ascending: false })
      .limit(30) // Last 30 days

    if (attendanceError) {
      console.error("Error fetching attendance:", attendanceError)
    } else {
      attendanceRecords = userAttendance || []
    }
  } else {
    // Faculty and admin can see all attendance records
    const { data: allAttendance, error: attendanceError } = await supabase
      .from("attendance")
      .select(`
        *,
        user:users (
          full_name,
          student_id,
          department,
          year
        )
      `)
      .order("date", { ascending: false })
      .limit(100)

    if (attendanceError) {
      console.error("Error fetching all attendance:", attendanceError)
    } else {
      attendanceRecords = allAttendance || []
    }
  }

  // Check if student has already marked attendance today
  let todayAttendance = null
  if (userProfile.role === "student") {
    const today = new Date().toISOString().split("T")[0]
    const { data: todayRecord, error: todayError } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userProfile.id)
      .eq("date", today)
      .single()

    if (!todayError && todayRecord) {
      todayAttendance = todayRecord
    }
  }

  return <AttendanceView user={userProfile} attendanceRecords={attendanceRecords} todayAttendance={todayAttendance} />
}
