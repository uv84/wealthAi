"use client";
import { Home, Plus, Nfc } from "lucide-react";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
import { getUserAccounts, type DashboardAccount } from "@/actions/dashboard";
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
  const pathname = usePathname();
  const [accounts, setAccounts] = useState<DashboardAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress ??
    "User";

  // Fetch accounts on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const data = await getUserAccounts();
        setAccounts(data);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <Sidebar>
      <SidebarContent className="mb-1">
        <SidebarGroup >
          <SidebarGroupLabel className="flex  items-center mb-6 mt-4">
              <Link href="/dashboard">
            <div className="flex items-center justify-center">
                <Image src="/logo-sm.png" alt="logo" height={12} width={45} />
                <span
                  className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-400 bg-clip-text text-transparent">
                  Wealth-Ai
                </span>
            </div>
              </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || pathname?.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link 
                        href={item.url}
                        className={isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
          
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="flex  items-center mb-2">
            <div className="flex items-center justify-center">
              <span className="ml-2 text-xl font-bold">Accounts</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <SidebarMenuItem>
                  <span className="text-sm text-muted-foreground px-2">Loading accounts...</span>
                </SidebarMenuItem>
              ) : accounts.length === 0 ? (
                <SidebarMenuItem>
                  <span className="text-sm text-muted-foreground px-2">No accounts yet</span>
                </SidebarMenuItem>
              ) : (
                accounts.map((account) => {
                  const accountUrl = `/account/${account.id}`;
                  const isActive = pathname === accountUrl || pathname?.startsWith(accountUrl + "/");
                  return (
                    <SidebarMenuItem key={account.id}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link 
                          href={accountUrl}
                          className={isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                        >
                          <span className="truncate">{account.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            ${account.balance.toFixed(2)}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
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
