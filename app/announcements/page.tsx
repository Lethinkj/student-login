import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnnouncementsView } from "@/components/announcements/announcements-view"

export default async function AnnouncementsPage() {
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

  // Get announcements based on user role
  const { data: announcements, error: announcementsError } = await supabase
    .from("announcements")
    .select(`
      *,
      created_by_user:users!announcements_created_by_fkey (
        full_name,
        department
      )
    `)
    .contains("target_audience", [userProfile.role])
    .order("created_at", { ascending: false })

  if (announcementsError) {
    console.error("Error fetching announcements:", announcementsError)
  }

  return <AnnouncementsView user={userProfile} announcements={announcements || []} />
}
