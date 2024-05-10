"use client";


import { useSocketStore } from "@/store/socket";
import { useEffect } from "react";
import Cookies from "js-cookie";

const SocketTest = () => {
  const userCookie = Cookies.get("jwttoken");
  const { connect, disconnect } = useSocketStore();

  const newSocket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (userCookie) {
      connect('user');

      return () => {
        // console.log("disconnecting...");
        disconnect();
      };
    }
  }, [userCookie]);

  useEffect(() => {
    if (newSocket) {
      // console.log(newSocket);
      newSocket.on("trainerOnline", (data) => {
        // console.log("trainer online");
        // console.log(data);
      });
      newSocket.on("trainerOffline", (data) => {
        // console.log("trainer offline");
        // console.log(data);
      });
    } else {
      // console.log("newSocket is null user");
    }
  }, [newSocket]);

  return <div></div>;
};

export default SocketTest;
