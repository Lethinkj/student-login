"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Award, BookOpen, Calendar, Users } from "lucide-react"

export function PointsSystem() {
  const pointCategories = [
    {
      icon: BookOpen,
      title: "Academic Performance",
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: [
        { activity: "Assignment submitted on time", points: 10 },
        { activity: "Assignment grade A", points: 50 },
        { activity: "Assignment grade B", points: 30 },
        { activity: "Assignment grade C", points: 15 },
        { activity: "Perfect quiz score", points: 25 },
      ],
    },
    {
      icon: Calendar,
      title: "Attendance & Punctuality",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        { activity: "Daily attendance", points: 5 },
        { activity: "Perfect weekly attendance", points: 40 },
        { activity: "Perfect monthly attendance", points: 200 },
        { activity: "Early arrival (15+ min)", points: 2 },
      ],
    },
    {
      icon: Users,
      title: "Community & Participation",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        { activity: "Help a classmate", points: 15 },
        { activity: "Participate in discussion", points: 10 },
        { activity: "Lead study group", points: 30 },
        { activity: "Volunteer for event", points: 50 },
      ],
    },
  ]

  const achievements = [
    {
      name: "Perfect Attendance",
      description: "100% attendance for a month",
      icon: Calendar,
      color: "text-green-600",
      requirement: "30 consecutive days present",
    },
    {
      name: "Academic Excellence",
      description: "Maintain A average for semester",
      icon: Trophy,
      color: "text-yellow-600",
      requirement: "GPA ≥ 3.7 for semester",
    },
    {
      name: "Community Helper",
      description: "Help 10 different classmates",
      icon: Users,
      color: "text-blue-600",
      requirement: "Assist 10 unique students",
    },
    {
      name: "Early Bird",
      description: "Arrive early 20 times",
      icon: Star,
      color: "text-purple-600",
      requirement: "20 early arrivals (15+ min)",
    },
    {
      name: "Study Leader",
      description: "Lead 5 study sessions",
      icon: BookOpen,
      color: "text-indigo-600",
      requirement: "Organize 5 study groups",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Points Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pointCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${category.color}`}>
                  <Icon className="h-5 w-5" />
                  {category.title}
                </CardTitle>
                <CardDescription>Ways to earn points in this category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((item, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${category.bgColor}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.activity}</span>
                        <Badge variant="secondary" className="text-xs">
                          +{item.points} pts
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Available Achievements
          </CardTitle>
          <CardDescription>Special badges you can earn through consistent performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`h-6 w-6 ${achievement.color}`} />
                    <h4 className="font-semibold">{achievement.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <p className="text-xs text-gray-500">{achievement.requirement}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
