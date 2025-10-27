"use client";
import { Home, Plus, Nfc } from "lucide-react";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
// removed unused dropdown imports

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Add Transaction",
    url: "/transaction/create",
    icon: Plus,
  },
  {
    title: "Contact Us",
    url: "/contact-us",
    icon: Nfc,
  },
  
];

export function AppSidebar() {
    const { user } = useUser();
  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress ??
    "User";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex  items-center mb-6 mt-4">
            <div className="flex items-center justify-center">
              <Image src="/logo-sm.png" alt="logo" height={12} width={45} />
              <span className="ml-2 text-2xl font-bold">Welth-Ai</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignedIn>
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 z-10",
                },
              }}
            />
            <span className="text-sm">{displayName}</span>
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}
