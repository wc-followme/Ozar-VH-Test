"use client"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Notification } from "../icons/Notification"
import { Input } from "../ui/input"
import { Search } from "../icons/Search"

export function Header() {
  const { user, logout } = useAuth()
  const [type, setType] = useState("Contractor");
  
  return (
    <header className="bg-[var(--white-background)] px-6 py-3">
      <div className=" flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Virtual Homes</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center border-2 border-[var(--border-dark)] rounded-[20px] overflow-hidden w-[443px]">

            {/* Search Input */}
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-4 h-12 border-2 text-[16px] border-0 focus:border-green-500 focus:ring-green-500 bg-transparent rounded-[10px] placeholder-[#C0C6CD]"
              required
            />
            {/* Type Selector */}
            {/* <div className="flex items-center px-3 cursor-pointer gap-1">
              <span className="text-gray-900 font-medium text-sm">{type}</span>
              <ChevronDown className=" text-gray-700" />
            </div> */}

            {/* Search Button */}
            <Button className="bg-[#263796] hover:bg-[#263796] text-white h-10 w-10 flex items-center justify-center rounded-[16px] m-1">
              <Search />
            </Button>
          </div>
          <ModeToggle />
          <Link href="/"><Notification /></Link>

          <Button className="h-10 w-[40px] h-[40px] rounded-full p-0 overflow-hidden" onClick={logout}>
            <Image src={"/images/profile.jpg"} alt="profile" width={40} height={40} className="h-full w-full" />
          </Button>
        </div>
      </div>
    </header>
  )
}
