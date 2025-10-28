import DashboardPage from "./page";
import { Suspense } from "react";
import DashboardLoading from "@/components/dashboard-loading";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "WelthAi-Dashboard",
  description: "One stop Finance Platform",
};

export default function Layout() {
  return (
    <div className="px-5">
      <SiteHeader value="Dashboard" />
     
      <Suspense
        fallback={<DashboardLoading />}
      >
        <DashboardPage />
      </Suspense>
      
      {/* <DashboardLoading /> */}
      
    </div>
  );
}
