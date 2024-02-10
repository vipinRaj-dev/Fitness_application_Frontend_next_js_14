"use client";

import React from "react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


const Adminhomepage = () => {
  const router = useRouter();
  
  const logout = () => {
    Cookies.remove("jwttoken");
    console.log("logout");  
    router.push("/");
    window.location.reload();
  };
  return (
    <div>
      Admin homepage  components
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Adminhomepage;
