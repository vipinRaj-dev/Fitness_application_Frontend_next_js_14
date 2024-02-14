"use client";
import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import { baseUrl } from "@/Utils/PortDetails";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    let myCookie = Cookies.get("jwttoken");
    if (myCookie) {
      axios
        .get(`${baseUrl}/auth/role`, {
          headers: {
            Authorization: `Bearer ${myCookie}`,
          },
        })
        .then((res) => {
          setRole(res.data.role);
          setLoading(false);
        })
        .catch(function (error) {
          setError(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      switch (role) {
        case "admin":
          router.push("/admin");
          break;
        case "user":
          router.push("/user");
          break;
        case "trainer":
          router.push("/trainer");
          break;
      }
    }
  }, [role, loading]);

  if (loading) {
    return <div>Loading... from Dashboard</div>; // Replace this with your loading component or any placeholder content
  }

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  if (role === "") {
    return (
      <div>
        <h1 className="text-red-600 text-4xl text-center ">Landing page</h1>
        <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
          <Button>Sign in</Button>
        </Link>
        <Link href="/sign-up" className={buttonVariants({ variant: "ghost" })}>
          Sign up
        </Link>
      </div>
    );
  }
};

export default Dashboard;