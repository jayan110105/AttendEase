import type { ReactNode } from "react"
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
import { LogoutButton } from "@/components/logout-button"
import { getCurrentUserWithEmployee, autoLinkUserByEmail } from "@/lib/auth-actions"
import { getRoleDisplayName } from "@/lib/roles"
import { getHighestRole } from "@/lib/employee-service"

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children}: DashboardLayoutProps) {
  const userEmployee = await getCurrentUserWithEmployee();
  
  // Try to auto-link user to employee if not already linked
  if (userEmployee && !userEmployee.employee) {
    await autoLinkUserByEmail();
    // Note: We could refetch here, but for now we'll just show the user info
  }

  const user = userEmployee?.user;
  const employee = userEmployee?.employee;
  const userRole = userEmployee ? getHighestRole(userEmployee.roles) : undefined;
  const roleDisplayName = userRole ? getRoleDisplayName(userRole) : "User";

  return (
    <SidebarProvider>
        <AppSidebar />

        <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-50 flex h-16 items-center justify-end bg-background px-4 gap-2 sm:px-6 lg:px-8">
                <Button variant="ghost" size="icon" className="[&_svg]:size-6 p-5 rounded-full">
                    <BellIcon className="h-6 w-6 text-[#67717c]" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 rounded-full">
                        <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>
                          {employee?.firstName && employee?.lastName
                            ? `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()
                            : user?.name 
                            ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                            : 'U'
                          }
                        </AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" forceMount className = "[&_svg]:size-6 min-w-[200px]">
                        <DropdownMenuLabel className="font-normal px-6">
                            <div className="flex flex-col items-center space-y-1">
                            <p className="text-base font-medium">{user?.name ?? "User"}</p>
                            <p className="text-sm text-muted-foreground">{user?.email ?? "No email"}</p>
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
                            <div className="w-full px-2">
                                <LogoutButton className="rounded-lg py-3 w-full flex justify-center items-center bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-colors duration-200">
                                    Logout
                                </LogoutButton>
                            </div>        
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="flex-1 overflow-auto bg-white p-6">{children}</main>
        </div>
    </SidebarProvider>
  )
}