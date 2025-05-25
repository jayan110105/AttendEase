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
        <div className="flex items-center gap-2 px-4 py-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <div className="flex items-center justify-center rounded-full bg-white text-[#1e3a8a]">
              <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
            </div>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
            {currentRole.links.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild className="[&_svg]:size-6">
                  <a href={link.href}>
                    <link.icon/>
                    <span>{link.label}</span>
                  </a>
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