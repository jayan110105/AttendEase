import type { ReactNode } from "react"
import Link from "next/link"
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
import BellIcon from "@/components/icons/BellIcon"
import ProfileIcon from "@/components/icons/ProfileIcon"
import SettingIcon from "@/components/icons/SettingIcon"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"

interface DashboardLayoutProps {
  children: ReactNode
  role: "admin"
}

export default function DashboardLayout({ children}: DashboardLayoutProps) {

  return (
    <SidebarProvider>
        <AppSidebar />

        <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-50 flex h-16 items-center justify-end border-b bg-background px-4 sm:px-6 lg:px-8">
                <Button variant="ghost" size="icon">
                    <BellIcon className="h-6 w-6 text-[#67717c]" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0">
                        <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col items-center space-y-1">
                        <p className="text-base font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">john@example.com</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                        <ProfileIcon className="mr-2" />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <SettingIcon className="mr-2" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/login" className="w-full text-center text-red-600">
                        Logout
                        </Link>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="flex-1 overflow-auto bg-white p-6">{children}</main>
        </div>
    </SidebarProvider>
  )
}