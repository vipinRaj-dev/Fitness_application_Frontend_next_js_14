import RoleAuthenticationCheckAdmin from "@/components/rolecheck/RoleAuthenticationCheckAdmin";
import { Button } from "@/components/ui/button";
import HomePageLogout from "@/components/usersidecomponents/HomePageLogout";
import Link from "next/link";

import Sidebar from '@/components/recharts/Sidebar'
import Navbar from '@/components/recharts/Navbar'
import Charts from '@/components/recharts/Charts'

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
      {/* <AdminLayout /> */}

      {/* <div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex items-center justify-between h-16 bg-slate-800 border-b border-gray-200">
            <div className="flex items-center px-4"></div>
            <div className="flex items-center pr-4">
              <HomePageLogout />
            </div>
          </div>
          <div className="flex h-screen">
            <div className="hidden md:flex flex-col w-64 bg-gray-800">
              <div className="flex items-center justify-center h-16 bg-gray-900">
                <span className="text-white font-bold uppercase">Sidebar</span>
              </div>
              <div className="flex flex-col flex-1 overflow-y-auto ">
                <nav className="flex-1 px-2 py-4 bg-gray-800">
                  <div className="flex flex-col gap-7 p-10">
                    <Link href="/admin">
                      <Button>dashboard</Button>
                    </Link>
                    <Link href="/admin/users">
                      <Button>Users</Button>
                    </Link>
                  </div>
                </nav>
              </div>
            </div>

            <div className="w-full p-10">
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex">
    <Sidebar/>
    <main className="flex-grow ml-64 relative">
          <Navbar />
      {children}
    </main>
    </div>
    </>
  );
}
