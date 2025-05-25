import Link from "next/link"
import Image from "next/image"
import { Sidebar, SidebarHeader, SidebarMenuItem, SidebarFooter, SidebarMenuButton, SidebarGroup, SidebarContent, SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import DashboardIcon from "@/components/icons/DashboardIcon"
import CalendarIcon from "@/components/icons/CalendarIcon"

export default function AppSidebar() {

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

  const currentRole = roleInfo.admin

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 pr-0 pl-5 pt-3 pb-0">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <div className="flex items-center justify-center rounded-full bg-white text-[#1e3a8a]">
              <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
            </div>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu>
            {currentRole.links.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild className="[&_svg]:size-6 h-11">
                  <Link href={link.href} className="flex items-center gap-3 rounded-md px-3 py-4 text-sm font-medium">
                    <link.icon/>
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto px-4 py-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          Close
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}