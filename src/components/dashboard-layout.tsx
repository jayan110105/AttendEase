"use client"

import type React from "react"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import CalendarIcon from "@/components/icons/CalendarIcon"
import DashboardIcon from "@/components/icons/DashboardIcon"
import BellIcon from "@/components/icons/BellIcon"
import ProfileIcon from "@/components/icons/ProfileIcon"
import SettingIcon from "@/components/icons/SettingIcon"
import MenuIcon from "@/components/icons/MenuIcon"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface DashboardLayoutProps {
  children: ReactNode
  role: "admin"
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const roleInfo = {
    admin: {
      name: "Admin Dashboard",
      initials: "AD",
      links: [
        { href: "/admin", label: "Overview", icon: DashboardIcon },
        { href: "/admin/events", label: "Events", icon: CalendarIcon },
      ],
    },
  }

  const currentRole = roleInfo[role]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky justify-between top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:px-8">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden [&_svg]:size-6">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex h-14 items-center border-b px-6">
              <Link href={`/${role}`} className="flex items-center gap-2 font-semibold">
                <div className="flex items-center justify-center rounded-full bg-white text-[#1e3a8a]">
                  <Image
                    src="/images/logo.png" 
                    alt="Company Logo"
                    width={40}
                    height={40}
                  />
                </div>
              </Link>
            </div>
            <nav className="grid gap-1 p-2">
              {currentRole.links.map((link) => {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      pathname === link.href
                      ? "text-[#00ac73] bg-[#f1f8f4]"
                      : "text-[#637480] hover:bg-[#f7f7f8]"
                    )}
                  >
                    <link.icon className="h-6 w-6" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="hidden lg:flex h-14 items-center border-b border-white/10">
            <Link href={`/${role}`} className="flex items-center gap-2 font-semibold">
              <div className="flex items-center justify-center rounded-full bg-white text-[#1e3a8a]">
                <Image
                    src="/images/logo.png" // or from public directory
                    alt="Company Logo"
                    width={40}
                    height={40}
                  />
              </div>
            </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="[&_svg]:size-6 rounded-full p-2">
            <BellIcon className="h-6 w-6 text-[#67717c]" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex items-center gap-2 rounded-full p-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 items-center">
                  <p className="text-base font-medium leading-none">John Doe</p>
                  <p className="text-sm leading-none text-muted-foreground">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="[&>svg]:size-6">
                <ProfileIcon className="mr-2 text-[#67717c]" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="[&>svg]:size-6">
                <SettingIcon className="mr-2 text-[#67717c]" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/login"
                  className="w-full px-6 py-3 bg-red-100 text-red-700 rounded-l font-semibold flex items-center justify-center text-sm"
                >
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-72 flex-col border-r lg:flex">
          <nav className="grid gap-1 p-2">
            {currentRole.links.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === link.href
                      ? "text-[#00ac73] bg-[#f1f8f4]"
                      : "text-[#637480] hover:bg-[#f7f7f8]"
                  )}
                >
                  <link.icon className="h-6 w-6" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto bg-[#f8f9fa] p-6">{children}</main>
      </div>
    </div>
  )
}

