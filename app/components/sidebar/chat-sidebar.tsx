"use client"

import * as React from "react"
import { Infinity, Home, Map, SquareUser, GraduationCap, Briefcase, User } from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger
} from "../ui/sidebar"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
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
            icon: SquareUser,
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
            title: "People",
            url: "#",
            icon: User,
        }
    ],
}

export function ChatSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <>
        <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="position-absolute top-0 left-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="#">
                  <Infinity className="h-5 w-5" />
                  <span className="text-base font-semibold">Pathfinity</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
      <SidebarTrigger className="position-fixed top-0 p-2" />
    </>

    )
}