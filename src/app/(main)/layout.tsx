import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import React from "react";
import { SiteHeader } from "@/components/site-header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <SidebarProvider>
        <AppSidebar />
        {/* <SidebarTrigger /> */}
        <div className="container mx-auto my-2 bg-background">{children}</div>
        
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
