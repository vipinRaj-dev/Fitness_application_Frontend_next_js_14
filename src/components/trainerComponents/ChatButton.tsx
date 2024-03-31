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
import Link from "next/link";
import { Video } from "lucide-react";

type Client = {
  isOnline?: boolean;
  name: string;
  profileImage?: string;
  _id: string;
  pendingMessageCount: number;
};

const ChatButton = () => {
  const userCookie = Cookies.get("jwttoken");

  // const newSocket = useSocketStore((state) => state.socket);

  const { connect, disconnect } = useSocketStore();
  const [clients, setClients] = useState<Client[]>([
    {
      name: "",
      profileImage: "",
      _id: "",
      pendingMessageCount: 0,
    },
  ]);

  const [trainerId, setTrainerId] = useState("");

  const [totalPendingMessages, setTotalPendingMessages] = useState(0);

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
          const updatedClients = res.data.clients.map((client: Client) => {
            const pendingMsgCountObj = res.data.pendingMessageCountPerUser.find(
              (countObj: { _id: string; count: number }) =>
                countObj._id === client._id
            );
            return {
              ...client,
              pendingMessageCount: pendingMsgCountObj
                ? pendingMsgCountObj.count
                : 0,
            };
          });
          setClients(updatedClients);
          setTrainerId(res.data.trainerId);

          // Calculate total pending messages
          const totalPendingMessages = updatedClients.reduce(
            (total: number, client: Client) =>
              total + client.pendingMessageCount,
            0
          );
          setTotalPendingMessages(totalPendingMessages);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    // Call connect when the component mounts
    useSocketStore.getState().connect("trainer");

    console.log("Socket connecting==========================================");
    const newSocket = useSocketStore.getState().socket;

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
      newSocket.on("messageRecieved", (data) => {
        setClients((prev) =>
          prev.map((client) =>
            client._id === data.senderId
              ? {
                  ...client,
                  pendingMessageCount:
                    chatPageOpen && SelectedUserDetails._id === data.senderId
                      ? client.pendingMessageCount
                      : (isNaN(client.pendingMessageCount)
                          ? 0
                          : client.pendingMessageCount) + 1,
                }
              : client
          )
        );

        if (!(chatPageOpen && SelectedUserDetails._id === data.senderId)) {
          setTotalPendingMessages((prev) => prev + 1);
        }
      });
    }

    // Call disconnect when the component unmounts
    return () => {
      console.log(
        "Socket disconnecting=========================================="
      );
      if (newSocket) {
        newSocket.off("messageRecieved");
        newSocket.off("clientOnline");
        newSocket.off("clientOffline");
      }
      useSocketStore.getState().disconnect();
    };
  }, [chatPageOpen, SelectedUserDetails]);

  // const makeMsgSeen = async (receiverId: string) => {
  //   const newSocket = useSocketStore.getState().socket;

  //   if (newSocket) {
  //     newSocket.emit("makeMsgSeen", {
  //       senderId: trainerId,
  //       receiverId: receiverId,
  //     });
  //   }
  // };
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          Chat {totalPendingMessages > 0 && `(${totalPendingMessages})`}
        </SheetTrigger>
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
                    // makeMsgSeen(client._id);
                    setClients((prev) =>
                      prev.map((c) =>
                        c._id === client._id
                          ? { ...c, pendingMessageCount: 0 }
                          : c
                      )
                    );
                    setTotalPendingMessages(
                      (prev) => prev - client.pendingMessageCount
                    );
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
                    <p className="text-red-400 p-3">
                      {client.pendingMessageCount > 0 &&
                        client.pendingMessageCount}
                    </p>
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
          <DialogContent className="h-screen bg-transparent border-none">
            <div className="h-screen flex flex-col p-5 pb-10">
              <div className="flex items-center justify-between bg-gray-900 p-2 rounded-t-xl">
                <div className="flex items-center">
                  <Image
                    className={`rounded-full w-10 h-10 border-2 ${
                      SelectedUserDetails.isOnline
                        ? "border-green-500"
                        : "border-red-500"
                    }`}
                    src={
                      (SelectedUserDetails.profileImage &&
                        SelectedUserDetails.profileImage) ||
                      "/images/profileImage.avif"
                    }
                    width={50}
                    height={50}
                    alt="profilePicture"
                  />
                  <h1 className="ml-3">
                    {SelectedUserDetails && SelectedUserDetails.name}
                  </h1>
                </div>
                <div className="">
                <Link href={`/room/${SelectedUserDetails._id}`}><Video /></Link>
                </div>
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
