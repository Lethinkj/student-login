"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import {
  BookOpen,
  Calendar,
  Home,
  LogOut,
  Menu,
  Trophy,
  UtensilsCrossed,
  FileText,
  Bell,
  Users,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    full_name: string
    role: string
    email: string
  }
  activeTab?: string
}

export function DashboardLayout({ children, user, activeTab = "dashboard" }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const getNavigationItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
      { id: "leaderboard", label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
      { id: "assignments", label: "Assignments", icon: BookOpen, href: "/assignments" },
      { id: "canteen", label: "Canteen", icon: UtensilsCrossed, href: "/canteen" },
      { id: "announcements", label: "Announcements", icon: Bell, href: "/announcements" },
    ]

    if (user.role === "student") {
      return [
        ...baseItems,
        { id: "notes", label: "My Notes", icon: FileText, href: "/notes" },
        { id: "leave", label: "Leave Requests", icon: Calendar, href: "/leave" },
        { id: "attendance", label: "My Attendance", icon: BarChart3, href: "/attendance" },
      ]
    }

    if (user.role === "faculty") {
      return [
        ...baseItems,
        { id: "students", label: "Students", icon: Users, href: "/students" },
        { id: "leave", label: "Leave Management", icon: Calendar, href: "/leave" },
        { id: "attendance", label: "Attendance", icon: BarChart3, href: "/attendance" },
      ]
    }

    if (user.role === "admin") {
      return [
        ...baseItems,
        { id: "users", label: "User Management", icon: Users, href: "/users" },
        { id: "leave", label: "Leave Management", icon: Calendar, href: "/leave" },
        { id: "attendance", label: "Attendance", icon: BarChart3, href: "/attendance" },
      ]
    }

    return baseItems
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Student Portal</h1>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
