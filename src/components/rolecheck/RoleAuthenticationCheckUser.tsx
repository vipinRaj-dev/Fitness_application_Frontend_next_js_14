"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Spinner from "../loadingui/Spinner";

const RoleAuthenticationCheckUser= () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const myCookie = Cookies.get("jwttoken");

    if(myCookie){
      axios
      .get(`${baseUrl}/auth/role`, {
        headers: {
          Authorization: `Bearer ${myCookie}`,
        },
      })
      .then((res) => {
        if (res.data.role !== "user") {
          window.location.href = "/";
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("error inside the roleAuthenticationCheckuser", error);
      });
    }else{
      window.location.href = "/sign-in";
    }
  }, []);
  if (loading) { 
    return (
      <div>
        <Spinner />
      </div>
    ); // Or your custom loading component
  }
  return <div>roleAuthenticationCheckAdmin component</div>;
};

export default RoleAuthenticationCheckUser;
