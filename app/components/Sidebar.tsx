"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Home, name: "Home", href: "/" },
  { icon: Image, name: "Base64 Image Decoder", href: "/base64-decoder" },
  { icon: FileText, name: "Help", href: "/help" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-5 bg-primary">
        <h1 className="text-2xl font-bold text-white">
          <span className="group-data-[collapsible=icon]:hidden">🦊 Tools</span>
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name} className="mb-2 pb-2 pt-2 ">
              <SidebarMenuButton
                asChild
                className={cn(pathname === item.href && "bg-muted")}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 ml-4 h-6 w-6" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
