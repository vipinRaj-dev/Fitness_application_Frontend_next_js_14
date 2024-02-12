"use client";

import React from "react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const UserLayout = () => {
  const router = useRouter();
  const logout = () => { 
    Cookies.remove("jwttoken");
    console.log("logout");
    router.replace("/sign-in");
    // window.location.reload();
  };
  return (
    <div>
      User Layout components
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default UserLayout;
