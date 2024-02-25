"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect } from "react";

const page = () => {
  useEffect(() => {
    const getallusers = async () => {
      try {
        await axiosInstance
          .get("/trainer/allClients")
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err.response.data);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getallusers();

    console.log("all users page");
  }, []);
  return <div>all users page</div>;
};

export default page;
