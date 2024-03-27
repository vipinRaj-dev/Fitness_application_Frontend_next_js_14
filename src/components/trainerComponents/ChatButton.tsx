"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Cookies from "js-cookie";
import axiosInstance from "@/axios/creatingInstance";
import { useSocketStore } from "@/store/socket";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Input } from "../ui/input";
import MessageList from "../commonRoutes/MessageList";

type Client = {
  isOnline?: boolean;
  name: string;
  profileImage?: string;
  _id: string;
};

const ChatButton = () => {
  const userCookie = Cookies.get("jwttoken");

  const newSocket = useSocketStore((state) => state.socket);

  const { connect, disconnect } = useSocketStore();
  const [clients, setClients] = useState<Client[]>([]);

  const [trainerId, setTrainerId] = useState("");

  const [SelectedUserDetails, setSelectedUserDetails] = useState({
    name: "",
    profileImage: "",
    _id: "",
    isOnline: false,
  });

  const [chatPageOpen, setChatPageOpen] = useState(false);

  useEffect(() => {
    try {
      axiosInstance
        .get("/trainer/getClients")
        .then((res) => {
          console.log(res.data);
          setClients(res.data.clients);
          setTrainerId(res.data.trainerId);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (userCookie) {
      connect("trainer");

      return () => {
        console.log("disconnecting...");
        disconnect();
      };
    }
  }, [userCookie]);

  useEffect(() => {
    if (newSocket) {
      newSocket.on("clientOnline", (data) => {
        console.log("clientOnline");
        console.log(data);

        setClients((prev) =>
          prev.map((client) =>
            client._id === data.clientId
              ? { ...client, isOnline: true }
              : client
          )
        );
        setSelectedUserDetails((prev) => {
          if (prev._id === data.clientId) {
            return { ...prev, isOnline: true };
          }
          return prev;
        });
      });
      newSocket.on("clientOffline", (data) => {
        console.log("clientOffline");
        console.log(data);
        setClients((prev) =>
          prev.map((client) =>
            client._id === data.clientId
              ? { ...client, isOnline: false }
              : client
          )
        );
        setSelectedUserDetails((prev) => {
          if (prev._id === data.clientId) {
            return { ...prev, isOnline: false };
          }
          return prev;
        });
      });
    } else {
      console.log("newSocket is null trainer");
    }
  }, [newSocket]);

  // const handleClick = (msg : string) => {
  //   if (newSocket && msg !== "") {
  //     newSocket.emit("sendMessage", {
  //       from: "trainer",
  //       text: msg,
  //       senderId: trainerId,
  //       receiverId: SelectedUserDetails._id,
  //     });
  //   }
  // };

  return (
    <div>
      <Sheet>
        <SheetTrigger>Chat</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Chat List</SheetTitle>
            <SheetDescription>
              {clients.map((client) => (
                <div
                  onClick={() => {
                    setSelectedUserDetails({
                      name: client.name,
                      profileImage: client.profileImage ?? "",
                      _id: client._id,
                      isOnline: client.isOnline ?? false,
                    });
                    setChatPageOpen(true);
                  }}
                  key={client._id}
                  className="flex items-center bg-slate-800 p-3 rounded-2xl mt-3 justify-between"
                >
                  <div className="flex">
                    <img
                      src={client?.profileImage}
                      alt="profilePicture"
                      className={`w-10 h-10 rounded-full ${
                        client.isOnline
                          ? "border-2 border-green-500"
                          : "border-2 border-red-500"
                      }`}
                    />
                    <p className="text-white ml-3">{client?.name}</p>
                  </div>
                  {client.isOnline ? (
                    <p className="text-green-500 ml-3 ">Online</p>
                  ) : (
                    <p className="text-red-500 ml-3 ">Offline</p>
                  )}
                </div>
              ))}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <div>
        <Dialog
          open={chatPageOpen}
          onOpenChange={(open) => {
            if (!open) {
              setChatPageOpen(false);
            }
          }}
        >
          <DialogContent>
            <div className="h-screen bg-slate-600 p-5">
              <div className="">
                <Image
                  src={
                    (SelectedUserDetails.profileImage &&
                      SelectedUserDetails.profileImage) ||
                    "/images/profileImage.avif"
                  }
                  width={50}
                  height={50}
                  alt="profilePicture"
                />
                <h1>{SelectedUserDetails && SelectedUserDetails.name}</h1>

                <h1>{SelectedUserDetails.isOnline ? "Online" : "Offline"}</h1>
              </div>
              <>
                <MessageList
                  from={"trainer"}
                  trainerId={trainerId}
                  userId={SelectedUserDetails._id}
                  // handleClicked={handleClick}
                />
              </>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChatButton;