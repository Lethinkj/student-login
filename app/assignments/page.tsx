import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AssignmentsView } from "@/components/assignments/assignments-view"

export default async function AssignmentsPage() {
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

  // Get assignments based on user role
  const assignmentsQuery = supabase
    .from("assignments")
    .select(`
      *,
      created_by_user:users!assignments_created_by_fkey (
        full_name,
        department
      )
    `)
    .order("created_at", { ascending: false })

  const { data: assignments, error: assignmentsError } = await assignmentsQuery

  if (assignmentsError) {
    console.error("Error fetching assignments:", assignmentsError)
  }

  // Get user's submissions if student
  let submissions = []
  if (userProfile.role === "student") {
    const { data: submissionsData, error: submissionsError } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("student_id", userProfile.id)

    if (submissionsError) {
      console.error("Error fetching submissions:", submissionsError)
    } else {
      submissions = submissionsData || []
    }
  }

  // Get all submissions if faculty/admin
  let allSubmissions = []
  if (userProfile.role === "faculty" || userProfile.role === "admin") {
    const { data: allSubmissionsData, error: allSubmissionsError } = await supabase
      .from("assignment_submissions")
      .select(`
        *,
        student:users!assignment_submissions_student_id_fkey (
          full_name,
          student_id,
          department,
          year
        ),
        assignment:assignments (
          title,
          subject
        )
      `)
      .order("submitted_at", { ascending: false })

    if (allSubmissionsError) {
      console.error("Error fetching all submissions:", allSubmissionsError)
    } else {
      allSubmissions = allSubmissionsData || []
    }
  }

  return (
    <AssignmentsView
      user={userProfile}
      assignments={assignments || []}
      userSubmissions={submissions}
      allSubmissions={allSubmissions}
    />
  )
}
