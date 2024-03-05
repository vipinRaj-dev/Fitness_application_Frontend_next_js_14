"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Spinner from "../loadingui/Spinner";
import swal from "sweetalert";
import { useRouter } from "next/navigation";

import { userStore } from "@/store/user";

const RoleAuthenticationCheckUser = () => {
  const [loading, setLoading] = useState(true);

  const setUser = userStore((state) => state.setUser);

  const router = useRouter();
  useEffect(() => {
    const myCookie = Cookies.get("jwttoken");

    if (myCookie) {
      axios
        .get(`${baseUrl}/auth/role`, {
          headers: {
            Authorization: `Bearer ${myCookie}`,
          },
        })
        .then((res) => {
          if (res.data.role !== "user") {
            router.replace("/NotAuthorized");
          } else {
            setUser({
              UserId: res.data.userId,
              email: res.data.email,
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log("user is blocked");
            swal({
              title: "Error!",
              text: "User blocked contact admin",
              icon: "error",
            }).then(() => {
              Cookies.remove("jwttoken");
              router.replace("/");
            });
          }
          console.log("error inside the roleAuthenticationCheckuser", error);
        });
    } else {
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
  return <></>;
};

export default RoleAuthenticationCheckUser;
