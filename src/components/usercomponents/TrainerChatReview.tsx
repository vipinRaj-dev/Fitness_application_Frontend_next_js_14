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
import { Radio } from "lucide-react";
import { useSocketStore } from "@/store/socket";
import Image from "next/image";
import MessageList from "../commonRoutes/MessageList";
import { Input } from "../ui/input";
import { userStore } from "@/store/user";

const TrainerChatReview = ({ trainer }: { trainer: Trainer }) => {
  const [isTrainerOnline, setIsTrainerOnline] = useState(false);
  const newSocket = useSocketStore((state) => state.socket);

  const userDetails = userStore((state) => state.user);

  const userId = userDetails.UserId;

  const [receivedMsg, setReceivedMsg] = useState({
    message: "",
  });

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
    } else {
      console.log("newSocket is null");
    }
  }, [newSocket]);

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

  // const handleClick = (msg : string) => {
  //   if (newSocket && msg !== "") {
  //     newSocket.emit("sendMessage", {
  //       from : "user",
  //       text: msg,
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
            onClick={() => {
              setChatPageOpen(true);
            }}
          >
            Msg
          </Badge>

          <Badge>Call</Badge>
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
            }
          }}
        >
          <DialogContent>
            <div className="h-screen bg-slate-600 p-5">
              <div className="">
                <Image
                  src={
                    (trainer.profilePicture && trainer.profilePicture) ||
                    "/images/profileImage.avif"
                  }
                  width={100}
                  height={100}
                  alt="profilePicture"
                />
                <h1>{trainer && trainer.name}</h1>

                <h1>{isTrainerOnline ? "Online" : "Offline"}</h1>
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