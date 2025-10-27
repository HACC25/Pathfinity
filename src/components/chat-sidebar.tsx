import { Home, Map, SquareUserRound, GraduationCap, Briefcase, Building2, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger
} from "../components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Roadmap",
    url: "#",
    icon: Map,
  },
  {
    title: "Profiles",
    url: "#",
    icon: SquareUserRound,
  },
  {
    title: "Majors",
    url: "#",
    icon: GraduationCap,
  },
  {
    title: "Careers",
    url: "#",
    icon: Briefcase,
  },
  {
    title: "Companies",
    url: "#",
    icon: Building2,
  },
  {
    title: "People",
    url: "#",
    icon: User,
  }
]

const ChatSidebar = () => {
  return (
    <div className="relative">
    <Sidebar side="left" collapsible="icon">
          <SidebarContent>
              <SidebarGroup>
                  <SidebarGroupLabel>Pathfinity</SidebarGroupLabel>
                  <SidebarGroupContent>
                      <SidebarMenu>
                          {items.map((item) => (
                              <SidebarMenuItem key={item.title}>
                                  <SidebarMenuButton asChild>
                                      <a href={item.url}>
                                          <item.icon />
                                          <span>{item.title}</span>
                                      </a>
                                  </SidebarMenuButton>
                              </SidebarMenuItem>
                          ))}
                      </SidebarMenu>
                  </SidebarGroupContent>
              </SidebarGroup>
              <SidebarFooter>

              </SidebarFooter>
          </SidebarContent>
      </Sidebar>
      <div className="absolute top-4 left-[var(--sidebar-width)] z-40 md:block">
          <SidebarTrigger />
        </div>
      </div>
  )
}

export default ChatSidebar;