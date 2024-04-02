"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import { Trainer } from "@/types/TrainerTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "../ui/badge";
import StarRatings from "react-star-ratings";
import { Button } from "../ui/button";
import { MessageSquareMore, Radio } from "lucide-react";
import { useSocketStore } from "@/store/socket";
import Image from "next/image";
import MessageList from "../commonRoutes/MessageList";
import { Input } from "../ui/input";
import { userStore } from "@/store/user";
import Link from "next/link";

const TrainerChatReview = ({
  trainer,
  userName,
}: {
  trainer: Trainer;
  userName: string;
}) => {
  const [isTrainerOnline, setIsTrainerOnline] = useState(false);
  const newSocket = useSocketStore((state) => state.socket);

  const userDetails = userStore((state) => state.user);

  const userId = userDetails.UserId;

  const [receivedMsg, setReceivedMsg] = useState({
    message: "",
  });

  const [pendingMsgCount, setPendingMsgCount] = useState(0);

  const [chatPageOpen, setChatPageOpen] = useState(false);
  useEffect(() => {
    if (newSocket) {
      console.log("newSocket is not null");
      console.log(newSocket);
      newSocket.on("trainerOnline", (data) => {
        console.log("trainer online");
        setIsTrainerOnline(true);
        console.log(data);
      });
      newSocket.on("trainerOffline", (data) => {
        console.log("trainer offline");
        setIsTrainerOnline(false);
        console.log(data);
      });

      return () => {
        if (newSocket) {
          newSocket.off("trainerOnline");
          newSocket.off("trainerOffline");
        }
      };
    } else {
      console.log("newSocket is null");
    }
  }, [newSocket]);

  useEffect(() => {
    try {
      axiosInstance
        .get(`/user/getTrainerOnlineStatus/${trainer._id}/${userId}`)
        .then((res) => {
          console.log(res.data);
          setIsTrainerOnline(res.data.onlineStatus);
          setPendingMsgCount(res.data.pendingMessageCount);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("error getting trainer online status", error);
    }
  }, []);

  useEffect(() => {
    if (newSocket && !chatPageOpen) {
      newSocket.on("messageRecieved", (data) => {
        console.log("incrementing the pending count");
        setPendingMsgCount((prev) => prev + 1);
      });
    }

    return () => {
      if (newSocket) {
        newSocket.off("messageRecieved");
      }
    };
  }, []);

  const [rating, setRating] = useState({
    starRating: 0,
    content: "",
  });

  const applyReview = async () => {
    console.log(rating);
    if (rating.starRating === 0) {
      swal({
        title: "warning!",
        text: "Please give a rating",
        icon: "warning",
        timer: 1500,
        buttons: {},
      });
    } else {
      await axiosInstance
        .post("/user/rating", {
          rating: rating.starRating,
          content: rating.content,
          trainerId: trainer._id,
        })
        .then((res) => {
          console.log(res.data);
          swal({
            title: "seccess!",
            text: "Rating Submitted",
            icon: "success",
            timer: 1500,
            buttons: {},
          });
        })
        .catch((err) => {
          console.log(err);
          swal({
            title: "warning!",
            text: "Rating not submitted",
            icon: "warning",
            timer: 1500,
            buttons: {},
          });
        });
    }
  };

  // const makeMsgSeen = async () => {
  //   // console.log("makeMsgSeen" , 'userId', userId, 'trainerId', trainer._id)
  //   if (newSocket) {
  //     newSocket.emit("makeMsgSeen", {
  //       senderId: userId,
  //       receiverId: trainer._id,
  //     });
  //   }
  // };
  return (
    <div className="flex justify-evenly">
      <img
        src={trainer.profilePicture}
        alt="trainer"
        width={50}
        height={50}
        className="rounded-full"
      />
      <div>
        <h1>{trainer.name}</h1>
        <div className="flex gap-2">
          <div>
            {isTrainerOnline ? (
              <Radio size="24px" color="green" />
            ) : (
              <Radio size="24px" color="red" />
            )}
          </div>
          <div>{isTrainerOnline ? "Online" : "Offline"}</div>
        </div>
      </div>

      <Dialog>
        <DialogTrigger>
          <Badge>Rate</Badge>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Do you want to Rate this Trainer</DialogTitle>
            <DialogDescription className="text-center">
              <StarRatings
                rating={rating.starRating}
                starRatedColor="yellow"
                starDimension="35px"
                starSpacing="2px"
                starHoverColor="yellow"
                starEmptyColor="white"
                changeRating={(rating) =>
                  setRating((prev) => {
                    return {
                      ...prev,
                      starRating: rating,
                    };
                  })
                }
                numberOfStars={5}
                name="rating"
              />
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Type you review here..."
            onChange={(e) => {
              setRating((prev) => {
                return {
                  ...prev,
                  content: e.target.value,
                };
              });
            }}
          />
          <Button onClick={applyReview}>Submit</Button>
        </DialogContent>
      </Dialog>
      {new Date(trainer.trainerPaymentDueDate) > new Date() ? (
        <>
          <Badge
            className={`${
              pendingMsgCount > 0 ? "animate-bounce" : ""
            } relative`}
            onClick={() => {
              setChatPageOpen(true);
              // makeMsgSeen();
            }}
          >
            <MessageSquareMore />
            <div className="bg-red-600 absolute top-0 right-1 w-4 text-center rounded-full">
              {pendingMsgCount > 0 && <p>{pendingMsgCount}</p>}
            </div>
            {/* Msg : {pendingMsgCount} */}
          </Badge>

          {isTrainerOnline ? (
            <Button>
              <Link href={`/room/${userId}`}>Meet</Link>
            </Button>
          ) : (
            <Button disabled>Meet</Button>
          )}
        </>
      ) : (
        <p className="text-sm text-red-500">Time Expired</p>
      )}

      <div>
        <Dialog
          open={chatPageOpen}
          onOpenChange={(open) => {
            if (!open) {
              setChatPageOpen(false);
              setPendingMsgCount(0);
            }
          }}
        >
          <DialogContent className="h-screen bg-transparent border-none">
            <div className="h-screen flex flex-col p-5 pb-10">
              <div className="flex items-center bg-gray-900 p-2 rounded-t-xl">
                <Image
                  className={`rounded-full w-10 h-10 border-2 ${
                    isTrainerOnline ? "border-green-500" : "border-red-500"
                  }`}
                  src={
                    (trainer.profilePicture && trainer.profilePicture) ||
                    "/images/profileImage.avif"
                  }
                  width={100}
                  height={100}
                  alt="profilePicture"
                />
                <h1 className="ml-3">{trainer && trainer.name}</h1>
              </div>
              <>
                <MessageList
                  from="user"
                  trainerId={trainer._id}
                  userId={userId}
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

export default TrainerChatReview;
