"use client";

import axiosInstance from "@/axios/creatingInstance";
import { use, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSocketStore } from "@/store/socket";
import moment from "moment";
import { Check, CheckCheck, Ghost, SendHorizontal } from "lucide-react";
type Message = {
  isSeen: boolean;
  message: string;
  receiverId: string;
  senderId: string;
  time: string;
  _id: string;
};

const MessageList = ({
  from,
  trainerId,
  userId,
}: // handleClicked,
{
  from: string;
  trainerId: string;
  userId: string;
  // handleClicked: (msg: string) => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [msg, setMsg] = useState("");

  const [userAndTrainerIds, setUserAndTrainerIds] = useState({
    userId: "",
    trainerId: "",
  });
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

  const [reRender, setReRender] = useState(false);

  const newSocket = useSocketStore((state) => state.socket);

  let senderId = "";
  let receiverId = "";
  //how is the sender and reciever
  if (from === "trainer") {
    senderId = trainerId;
    receiverId = userId;
  } else {
    senderId = userId;
    receiverId = trainerId;
  }

  // ...

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView();
    }
  }, []);
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView();
    }
  }, [messages]);

  //   console.log(from, trainerId, userId);
  useEffect(() => {
    // console.log(
    //   "from the message list ============================= re render"
    // );
    try {
      axiosInstance
        .get(`/chat/getMessages/${trainerId}/${userId}`)
        .then((res) => {
          // console.log(
          //   "from the message list =============================",
          //   res.data
          // );
          setMessages(res.data.messages.message);
          setUserAndTrainerIds({
            userId: res.data.messages.userId,
            trainerId: res.data.messages.trainerId,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, [reRender]);

  useEffect(() => {
    if (newSocket) {
      newSocket.emit("makeMsgSeen", {
        senderId,
        receiverId,
      });
    }
  }, []);

  useEffect(() => {
    if (newSocket) {
      newSocket.on("messageRecieved", (data) => {
        // console.log("Message recieved ==============================", data);

        // Emit by the sender
        newSocket.emit("makeMsgSeen", {
          senderId,
          receiverId,
        });

        // newSocket.emit("updateLiveMsg", { receiverId });

        if (from === "trainer" && userId === data.senderId) {
          setMessages([...messages, data]);
        } else if (from === "user" && trainerId === data.senderId) {
          setMessages([...messages, data]);
        }
      });
    }
  }, [newSocket, messages]);

  // useEffect(() => {
  //   if (newSocket) {
  //     // recieve by the reciever
  //     newSocket.on("toReciever", (data) => {
  //       console.log(
  //         "toReciever incomming data ===================",
  //         data,
  //         "sender id ==",
  //         senderId
  //       );
  //     });
  //   }
  // }, [messages, newSocket]);

  useEffect(() => {
    if (newSocket) {
      newSocket.on("msgSeen", (data) => {
        // console.log("message seen", data);
        // setReRender(!reRender);
        // console.log("messages", messages);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === data.senderId ? { ...msg, isSeen: true } : msg
          )
        );
      });
    }

    return () => {
      if (newSocket) {
        newSocket.off("msgSeen");
      }
    };
  }, [newSocket, messages]);

  useEffect(() => {
    if (newSocket) {
      // console.log("allSeen");
      newSocket.emit("allSeen", {
        from,
        trainerId,
        userId,
      });
      newSocket.on("allSeen", () => {
        // console.log("allSeen recieved");
        setMessages((prev) => {
          const updatedMessage = prev.map((msg) =>
            msg.senderId === (from == "user" ? userId : trainerId)
              ? { ...msg, isSeen: true }
              : msg
          );

          // console.log(updatedMessage, from == "user" ? userId : trainerId);
          return updatedMessage;
        });
      });
    }

    return () => {
      if (newSocket) {
        newSocket.off("allSeen");
      }
    };
  }, []);

  const handleClick = (msg: string) => {
    if (newSocket && msg !== "") {
      newSocket.emit(
        "sendMessage",
        {
          from: from,
          text: msg,
          senderId,
          receiverId,
        },
        (response: { status: string }) => {
          // console.log("server response", response);
          setMsg("");
          setReRender(!reRender);
        }
      );
    }
  };

  return (
    <>
      <div className="h-5/6 flex flex-col bg-slate-700 space-y-3 p-2 bg-[url('/images/chatImage2.jpg')] overflow-y-scroll scrollbar-none">
        {messages.map((msg: Message, index) => {
          return (
            <div
              key={index}
              className={msg.senderId === senderId ? "flex justify-end" : ""}
            >
              {msg.senderId === senderId ? (
                <div className="rounded-2xl p-2 bg-emerald-800 w-max">
                  <p>{msg.message}</p>
                  <p className=" text-sm text-right font-thin">
                    {moment(msg.time).format("hh:mm A")}
                  </p>
                  <div className="flex justify-end">
                    <p>
                      {msg.isSeen ? (
                        <CheckCheck size={18} color="#00ff11" strokeWidth={3} />
                      ) : (
                        <Check width={18} color="#828282" strokeWidth={3} />
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl p-2 bg-stone-600 max-w-72">
                  <p>{msg.message}</p>
                  <p className="text-right text-sm font-thin">
                    {moment(msg.time).format("hh:mm A")}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="bg-slate-800 flex">
        <Input
          className="bg-transparent border-none focus-visible:none outline-none"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClick(msg);
            }
          }}
          placeholder="Type a message"
        />
        <Button
          variant={"ghost"}
          className="rounded-r-none"
          onClick={() => {
            handleClick(msg);
          }}
        >
          <SendHorizontal color="#ffffff" />
        </Button>
      </div>
    </>
  );
};

export default MessageList;
