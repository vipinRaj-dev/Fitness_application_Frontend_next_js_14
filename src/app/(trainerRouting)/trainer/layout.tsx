import RoleAuthenticationCheckTrainer from "@/components/rolecheck/RoleAuthenticationCheckTrainer";
import HomePageLogout from "@/components/logoutComponent/HomePageLogout";

import {
  AlignJustify,
  Carrot,
  CircleUserRound,
  Dumbbell,
  Home,
  HomeIcon,
  IndianRupee,
  PersonStanding,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ChatButton from "@/components/trainerComponents/ChatButton";

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
      <RoleAuthenticationCheckTrainer />
      <div className="">
        {/* navbar */}

        <div className="m-10 ">
          <nav className="flex justify-between items-center">
            <Link href="/user">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl">Vigor</h1>
            </Link>
            <ul className="hidden lg:flex justify-center items-center border-2 p-3 rounded-3xl bg-slate-500 gap-2">
              <li>
                <Link
                  className="flex border-2 bg-slate-100 px-6 gap-1 border-none text-slate-800 rounded-3xl  p-2"
                  href="/trainer"
                >
                  {/* <Home /> */}
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="flex border-2 bg-slate-100 px-6 gap-1 border-none text-slate-800 rounded-3xl   p-2"
                  href="/trainer/allusers"
                >
                  {/* <Dumbbell /> */}
                  All Users
                </Link>
              </li>
              <li>
                <Link
                  className="flex border-2 bg-slate-100 px-6 gap-1 border-none text-slate-800 rounded-3xl  p-2"
                  href="/trainer/Payments"
                >
                  {/* <Carrot /> */}
                  Payments
                </Link>
              </li>
              <li>{/* <PersonStanding /> */}</li>
            </ul>

            <div className="flex">
              <div>
                <HomePageLogout />
              </div>
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger>
                    <AlignJustify />
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className="flex gap-2">
                        <CircleUserRound />
                        Hello Trainer, From Vigor
                      </SheetTitle>

                      <SheetDescription>Your account</SheetDescription>
                    </SheetHeader>
                    <div className="p-2 mt-6"></div>
                    <SheetClose asChild>
                      <div className="space-y-6 ml-7">
                        <a className="flex gap-2" href="/trainer/profile">
                          {/* <UserCog color="#0006b8" /> */}
                          Profile
                        </a>
                        <a className="flex gap-2" href="/trainer/allusers">
                          {/* <Dumbbell /> */}
                          All users
                        </a>
                        <a className="flex gap-2" href="/trainer/Payments">
                          {/* <Carrot /> */}
                          Payments
                        </a>
                        <a className="flex gap-2" href="/trainer/reviews">
                          {/* <PersonStanding /> */}
                          Reviews
                        </a>
                      </div>
                    </SheetClose>
                  </SheetContent>
                </Sheet>
              </div>
              <Avatar className="hidden lg:block">
                <Link href="/trainer/profile">
                  <AvatarImage src="images/profileImage.avif" />
                </Link>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </nav>
        </div>

        <div>{children}</div>
        <div className="fixed bottom-10 left-5">
          <ChatButton />
        </div>

        {/* <footer>
          <div className="bg-green-400">trainer footer</div>
        </footer> */}
      </div>
    </>
  );
}
