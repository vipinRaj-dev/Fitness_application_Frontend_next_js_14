import RoleAuthenticationCheckAdmin from "@/components/rolecheck/RoleAuthenticationCheckAdmin";
import { Button } from "@/components/ui/button";
import HomePageLogout from "@/components/logoutComponent/HomePageLogout";
import Link from "next/link";

import Sidebar from "@/components/recharts/Sidebar";
import Navbar from "@/components/recharts/Navbar";
import Charts from "@/components/recharts/Charts";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RoleAuthenticationCheckAdmin />

      <div className="flex">
        <Sidebar />
        <main className="flex-grow ml-64 relative">
          <Navbar />
          {children}
        </main>
      </div>
    </>
  );
}
