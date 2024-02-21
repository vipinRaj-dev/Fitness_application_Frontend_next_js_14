"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Spinner from "../loadingui/Spinner"; 

const RoleAuthenticationCheckAdmin = () => {
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
        if (res.data.role !== "admin") {
          window.location.href = "/NotAuthorized";
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("error inside the roleAuthenticationCheckAdmin", error);
      });
    }else{
      window.location.href = "/sign-in";
    }
  }, []);

  if (loading) {
    return (
      <div>
        Role Auth
        <Spinner />
      </div>
    ); 
  }
  return <></>
};

export default RoleAuthenticationCheckAdmin;
