"use client";

import { buttonVariants } from "../ui/button";
import Link from "next/link";
import Cookies from "js-cookie";

const Dashboard = () => {
  let myCookie = Cookies.get("jwttoken");
  console.log(myCookie);

  //get the user role from the cookie from the backend

    

  //if the user role is admin, redirect to the admin dashboard

  //if the user role is user, redirect to the user dashboard


  //if the role is trainer, redirect to the trainer dashboard


  // if there is no cookie, redirect to the landing page



  return (
    <div className="bg-red-200">
      <h1 className="text-red-600 text-4xl text-center ">Landing page</h1>
      <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
        Sign in
      </Link>
      <Link href="/sign-up" className={buttonVariants({ variant: "ghost" })}>
        Sign up
      </Link>
    </div>
  );
};

export default Dashboard;
