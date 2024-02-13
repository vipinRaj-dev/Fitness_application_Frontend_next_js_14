"use client";

import React from "react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const HomePageLogout = () => {
  const router = useRouter();
  const logout = () => {
    Cookies.remove("jwttoken");
    console.log("logout");
    router.replace("/sign-in");
    // window.location.reload();
  };
  return (
    <Button className="mx-4" onClick={logout}>
      Logout
    </Button>
  );
};

export default HomePageLogout;
