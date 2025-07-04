import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import type React from "react"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <div className="flex min-h-screen bg-[var(--white-background)]">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="rounded-t-[30px] p-6 bg-[var(--background)] h-full">{children}</main>
      </div>
    </div>
  )
}
