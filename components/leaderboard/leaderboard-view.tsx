"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Trophy, Medal, Award, Star, TrendingUp, Users } from "lucide-react"
import { useState } from "react"

interface LeaderboardEntry {
  id: string
  user_id: string
  points: number
  rank: number
  achievements: string[]
  users: {
    full_name: string
    student_id: string
    department: string
    year: number
  }
}

interface LeaderboardViewProps {
  user: {
    id: string
    full_name: string
    role: string
    email: string
  }
  leaderboardData: LeaderboardEntry[]
}

export function LeaderboardView({ user, leaderboardData }: LeaderboardViewProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")

  // Get unique departments and years for filtering
  const departments = Array.from(new Set(leaderboardData.map((entry) => entry.users.department))).filter(Boolean)
  const years = Array.from(new Set(leaderboardData.map((entry) => entry.users.year))).filter(Boolean)

  // Filter leaderboard data
  const filteredData = leaderboardData.filter((entry) => {
    const departmentMatch = selectedDepartment === "all" || entry.users.department === selectedDepartment
    const yearMatch = selectedYear === "all" || entry.users.year.toString() === selectedYear
    return departmentMatch && yearMatch
  })

  // Find current user's position
  const currentUserEntry = leaderboardData.find((entry) => entry.user_id === user.id)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <DashboardLayout user={user} activeTab="leaderboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Student Leaderboard</h1>
          <p className="text-purple-100">Compete with your peers and earn achievements</p>
        </div>

        {/* Current User Stats */}
        {currentUserEntry && user.role === "student" && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                Your Current Standing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(currentUserEntry.rank)}
                    <span className="text-lg font-semibold">Rank #{currentUserEntry.rank}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{currentUserEntry.points} points</div>
                </div>
                <div className="flex gap-2">
                  {currentUserEntry.achievements?.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDepartment === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDepartment("all")}
                  >
                    All Departments
                  </Button>
                  {departments.map((dept) => (
                    <Button
                      key={dept}
                      variant={selectedDepartment === dept ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDepartment(dept)}
                    >
                      {dept}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedYear === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear("all")}
                  >
                    All Years
                  </Button>
                  {years.map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedYear(year.toString())}
                    >
                      Year {year}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Students</span>
                  <span className="font-semibold">{filteredData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Points</span>
                  <span className="font-semibold">
                    {filteredData.length > 0
                      ? Math.round(filteredData.reduce((sum, entry) => sum + entry.points, 0) / filteredData.length)
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Top Score</span>
                  <span className="font-semibold">{filteredData[0]?.points || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Rankings
            </CardTitle>
            <CardDescription>
              {selectedDepartment !== "all" || selectedYear !== "all"
                ? `Filtered results: ${filteredData.length} students`
                : `Showing top ${filteredData.length} students`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No students found with the selected filters.</p>
                </div>
              ) : (
                filteredData.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      entry.user_id === user.id
                        ? "bg-blue-50 border-blue-200"
                        : index < 3
                          ? "bg-gradient-to-r from-gray-50 to-white border-gray-200"
                          : "bg-white border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(entry.rank)}`}
                      >
                        {entry.rank <= 3 ? getRankIcon(entry.rank) : <span className="font-bold">#{entry.rank}</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{entry.users.full_name}</h3>
                          {entry.user_id === user.id && (
                            <Badge variant="outline" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {entry.users.student_id} • {entry.users.department} • Year {entry.users.year}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{entry.points}</div>
                      <p className="text-xs text-gray-500">points</p>
                      {entry.achievements && entry.achievements.length > 0 && (
                        <div className="flex gap-1 mt-2 justify-end">
                          {entry.achievements.slice(0, 3).map((achievement, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                          {entry.achievements.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{entry.achievements.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievement Categories
            </CardTitle>
            <CardDescription>Earn points and badges by completing various activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Academic Excellence</h4>
                </div>
                <p className="text-sm text-green-700">Complete assignments on time and score high grades</p>
                <p className="text-xs text-green-600 mt-1">+50 points per A grade</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Perfect Attendance</h4>
                </div>
                <p className="text-sm text-blue-700">Maintain consistent attendance throughout the semester</p>
                <p className="text-xs text-blue-600 mt-1">+10 points per day</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Community Participation</h4>
                </div>
                <p className="text-sm text-purple-700">Participate in events and help fellow students</p>
                <p className="text-xs text-purple-600 mt-1">+25 points per activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
