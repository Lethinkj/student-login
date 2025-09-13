import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LeaderboardView } from "@/components/leaderboard/leaderboard-view"

export default async function LeaderboardPage() {
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

  // Get leaderboard data with user information
  const { data: leaderboardData, error: leaderboardError } = await supabase
    .from("leaderboard")
    .select(`
      *,
      users (
        full_name,
        student_id,
        department,
        year
      )
    `)
    .order("rank", { ascending: true })
    .limit(50)

  if (leaderboardError) {
    console.error("Error fetching leaderboard:", leaderboardError)
  }

  return <LeaderboardView user={userProfile} leaderboardData={leaderboardData || []} />
}
