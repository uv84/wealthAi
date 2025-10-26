import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import DashboardLoading from "@/components/dashboard-loading";

export const metadata = {
  title: "WelthAi-Dashboard",
  description: "One stop Finance Platform",
};

export default function Layout() {
  return (
    <div className="px-5">
     
      <Suspense
        fallback={<DashboardLoading />}
      >
        <DashboardPage />
      </Suspense>
      
      {/* <DashboardLoading /> */}
      
    </div>
  );
}
