"use client";

import React, { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import Spinner from "../loadingui/Spinner";
import { baseUrl } from "@/Utils/PortDetails";
import Userhomepage from "../homepages/Userhomepage";
import Adminhomepage from "../homepages/Adminhomepage";
import Trainerhomepage from "../homepages/Trainerhomepage";

const Dashboard = () => {
  let myCookie = Cookies.get("jwttoken");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, [myCookie]);

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  switch (role) {
    case "admin":
      return <Adminhomepage />;
    case "user":
      return <Userhomepage />;
    case "trainer":
      return <Trainerhomepage />;
    default:
      return (
        <div className="bg-red-200">
          <h1 className="text-red-600 text-4xl text-center ">Landing page</h1>
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "ghost" })}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className={buttonVariants({ variant: "ghost" })}
          >
            Sign up
          </Link>
        </div>
      );
  }
};

export default Dashboard;
