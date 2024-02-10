"use client";

import React from "react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


const AdminLayout = () => {
  const router = useRouter();
  
  const logout = () => {
    Cookies.remove("jwttoken");
    console.log("logout");  
    router.push("/");
    window.location.reload();
  };
  return (
    <div>
      Admin layout components
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default AdminLayout;
