"use client";

import { Button } from "@/components/ui/button";
import BarChartPlot from "@/components/recharts/BarChartPlot";

import Image from "next/image";
import FoodCard from "@/components/usercomponents/FoodCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/axios/creatingInstance";
import HomePageWorkout from "@/components/usercomponents/HomePageWorkout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { BarChartData } from "@/components/recharts/BarChartPlot";
import BarChartUser, {
  BarChartDataUser,
} from "@/components/recharts/BarChartUser";
import { Label } from "@/components/ui/label";

import { DietFoodType } from "@/types/FoodTypes";
import { HttpStatusCode } from "@/types/HttpStatusCode";
import { boolean } from "zod";
import axios from "axios";

type graphOrder = {
  [key: string]: number;
};

// const [socket, setSocket] = useState<Socket | null>(null);

const Userpage = () => {
  const [attendanceCreated, setAttendanceCreated] = useState(false);

  const [latestDiet, setLatestDiet] = useState<DietFoodType[]>([]);
  const [addedFoodDocIds, setAddedFoodDocIds] = useState<string[]>([]);
  const [hasTrainer, setHasTrainer] = useState(false);
  const [attendanceId, setAttendanceId] = useState<string>("");

  const [allTasksCompleted, setAllTasksCompleted] = useState<boolean>(true);

  const [yesterdayAttendanceId, setYesterdayAttendanceId] = useState("");

  // const [reason, setReason] = useState<string>("");

  const [openModal, setOpenModal] = useState(false);

  const [AttandanceGraph, setAttandanceGraph] = useState<BarChartData[] | null>(
    null
  );

  const [foodStatus, setFoodStatus] = useState<BarChartDataUser[] | null>(null);

  const [motivationalQuotes, setMotivationalQuotes] = useState({
    text: "",
    author: "",
  });
  const router = useRouter();

  function getMotivationalQuotes() {
    fetch("https://type.fit/api/quotes")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let randomIndex = Math.floor(Math.random() * data.length);
        setMotivationalQuotes(data[randomIndex]);
        // console.log(data[randomIndex]);
      });
  }

  useEffect(() => {
    // console.log('attendance useeffect running .......................................')
    getMotivationalQuotes();
    try {
      axiosInstance
        .get("/user/setAttendance")
        .then((res) => {
          // console.log('getAttendanance response======================================' , res)
          if (res.status === HttpStatusCode.OK) {
            setAttendanceCreated(true);
          }
        })
        .catch((err) => {
          if (err.response.status === 402) {
            router.replace("/user/subscription");
          }
        });
    } catch (err) {
      console.log("errro inside the attendance create", err);
    }
  }, []);

  const getAllGraphData = async () => {
    const orderOfWeek: graphOrder = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    const orderOfFood: graphOrder = {
      morning: 1,
      afternoon: 2,
      evening: 3,
    };
    await axiosInstance
      .get("/user/getGraphs")
      .then((res) => {
        // console.log("res.data graphs : ", res.data);

        const barData = res.data.attendancePerDay
          .sort(
            (a: { day: string }, b: { day: string }) =>
              orderOfWeek[a.day] - orderOfWeek[b.day]
          )
          .map((item: { day: string; NoOfDays: number }) => ({
            day: item.day,
            NoOfDays: item.NoOfDays,
          }));

        setAttandanceGraph(barData);

        const foodStatus = res.data.foodStatusData
          .sort(
            (a: { _id: string }, b: { _id: string }) =>
              orderOfFood[a._id] - orderOfFood[b._id]
          )
          .map(
            (item: {
              _id: string;
              totalFood: number;
              completedCount: number;
            }) => ({
              name: item._id,
              FoodCount: item.totalFood,
              ConsumedFood: item.completedCount,
            })
          );
        setFoodStatus(foodStatus);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const fetchUser = async () => {
      axiosInstance
        .get("/user/homePage")
        .then((res) => {
          // console.log("res.data from the user home page", res.data);
          if (res.status === HttpStatusCode.OK) {
            setLatestDiet(res.data.dietFood);
            setAddedFoodDocIds(res.data.addedFoodDocIds);
            setHasTrainer(res.data.hasTrainer);
            setAttendanceId(res.data.attendanceDocId);
            getAllGraphData();
            setAllTasksCompleted(res.data.allTasksCompleted);
            setYesterdayAttendanceId(res.data.yesterdayAttendanceId);
          }
        })
        .catch((err) => {
          console.log("error inside the api call");
          console.log(err);
          if (err.response.status === 402) {
            console.log("purchase");
            router.replace("/user/subscription");
          }
        });
    };
    if (attendanceCreated) {
      fetchUser();
    }
  }, [attendanceCreated]);

  useEffect(() => {
    if (!allTasksCompleted) {
      setOpenModal(true);
    }
  }, [allTasksCompleted]);

  // const sendReason = async (agree: boolean) => {
  //   try {
  //     axiosInstance
  //       .post("/user/applyReason", {
  //         reason,
  //         yesterdayAttendanceId,
  //         agree,
  //       })
  //       .then((res) => {
  //         // console.log(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="">
      <div className="w-full flex flex-wrap md:gap-5 md:justify-center ">
        <div className="w-full md:w-5/12 h-96 mt-8 md:rounded-3xl rounded-xl">
          <h1 className="font-semibold text-center p-5">Attandance</h1>
          <div className="h-full w-full pb-10">
            <BarChartPlot data={AttandanceGraph ? AttandanceGraph : []} />
          </div>
        </div>

        <div className="w-full md:w-5/12 h-96 mt-8 md:rounded-3xl rounded-xl p-2">
          <h1 className="font-semibold text-center p-5">Food Consumed</h1>
          <div className="h-full w-full pb-10">
            <BarChartUser data={foodStatus ? foodStatus : []} />
          </div>
        </div>
      </div>

      {/* <div>
        <Dialog
          open={openModal}
          onOpenChange={() => {
            setOpenModal(false);
            sendReason(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reason</DialogTitle>
              <DialogDescription>
                <div className="grid w-full gap-5">
                  <Label htmlFor="message-2">Your Message</Label>
                  <Textarea
                    onChange={(e) => {
                      setReason(e.target.value);
                    }}
                    placeholder="Type your message here."
                  />
                  <Button
                    onClick={() => {
                      // console.log(reason);
                      sendReason(true);
                      setOpenModal(false);
                    }}
                  >
                    Post
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div> */}

      <div>
        {/* <div className="h-3/6  gap-5 md:flex md:justify-evenly">
          <div className="flex justify-center">
            <div className="w-3/4">
              <img src="/images/bmi.png" alt="bmi" />
            </div>
          </div>

          <div className="p-2 mt-3 flex md:flex-col md:items-center md:justify-center md:space-y-9 ">
            <div className="text-sm font-semibold md:font-bold md:text-4xl">
              The hard days are the best <br /> because that&apos;s when <br />
              champions are made
            </div>

            <div className="flex items-center p-2">
              <Button className="md:px-10 md:font-semibold ">CHECK BMI</Button>
            </div>
          </div>
        </div> */}

        <div className="h-3/6  md:flex md:justify-evenly md:items-center">
          <div className="mt-3 hidden md:block w-4/12">
            <h1 className="text-xl font-semibold px-5 md:text-5xl md:font-bold md:tracking-wide md:leading-normal">
              {motivationalQuotes && motivationalQuotes.text}
            </h1>
            <p className="text-end italic opacity-50">
              {motivationalQuotes && motivationalQuotes.author}
            </p>
          </div>

          <div className="md:mt-24">
            <div>
              <img src="/images/gymbottle.svg" alt="bottle" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="diet" className="flex justify-center gap-5 py-8">
          <div>
            <h1 className="text-4xl font-semibold">Diet</h1>
          </div>
          {hasTrainer ? (
            ""
          ) : (
            <div>
              <Link href="/user/addFood">
                <Button className="bg-gradient-to-r from-green-200 to-slate-700 hover:from-slate-700 hover:to-green-200">
                  Edit Diet
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="md:flex md:justify-around">
          <div>
            <h1 className="text-2xl">Morning</h1>
            <div className="h-screen  space-y-3 overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
              {latestDiet &&
                [...latestDiet]
                  .sort((a, b) => {
                    return (
                      Number(a.time.replace(":", ".")) -
                      Number(b.time.replace(":", "."))
                    );
                  })
                  .map((food) => {
                    if (food.timePeriod === "morning")
                      return (
                        <FoodCard
                          key={food._id}
                          details={food}
                          addedFoodDocIds={addedFoodDocIds}
                          attendanceId={attendanceId}
                        />
                      );
                  })}
            </div>
          </div>
          <div>
            <h1 className="text-2xl">Noon</h1>
            <div className="h-screen  space-y-3 overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
              {latestDiet &&
                [...latestDiet]
                  .sort((a, b) => {
                    return (
                      Number(a.time.replace(":", ".")) -
                      Number(b.time.replace(":", "."))
                    );
                  })
                  .map((food) => {
                    if (food.timePeriod === "afternoon")
                      return (
                        <FoodCard
                          key={food._id}
                          details={food}
                          addedFoodDocIds={addedFoodDocIds}
                          attendanceId={attendanceId}
                        />
                      );
                  })}
            </div>
          </div>
          <div>
            <h1 className="text-2xl">Evening</h1>
            <div className="h-screen  space-y-3 overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
              {latestDiet &&
                [...latestDiet]
                  .sort((a, b) => {
                    return (
                      Number(a.time.replace(":", ".")) -
                      Number(b.time.replace(":", "."))
                    );
                  })
                  .map((food) => {
                    if (food.timePeriod === "evening")
                      return (
                        <FoodCard
                          key={food._id}
                          details={food}
                          addedFoodDocIds={addedFoodDocIds}
                          attendanceId={attendanceId}
                        />
                      );
                  })}
            </div>
          </div>
        </div>
      </div>

      <div id="Workout" className="h-screen  p-5">
        <div className="h-2/6 flex justify-center">
          <Image
            src={"/images/Dumbell_01 2.svg"}
            width={400}
            height={400}
            alt="dumbel"
          />
        </div>

        <HomePageWorkout hasTrainer={hasTrainer} />
      </div>

      {!hasTrainer && (
        <div id="purchasePlan">
          <div className=" p-10">
            <div className="flex items-center justify-center max-w-6xl mx-auto gap-6">
              <div className="w-full p-6 rounded-lg shadow-xl sm:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 sm:p-8">
                <div className="flex flex-col items-start justify-between gap-4 mb-6 lg:flex-row">
                  <div>
                    <h3 className="text-2xl font-semibold text-white jakarta sm:text-4xl">
                      Select Trainers
                    </h3>
                  </div>
                  <span className="order-first inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase bg-black rounded-full lg:order-none bg-opacity-20">
                    Go Pro
                  </span>
                </div>
                <div className="mb-4 space-x-2">
                  <span className="text-4xl font-bold text-white">
                    Strating from $15/mo
                  </span>
                  <span className="text-2xl text-indigo-100 line-through">
                    $39/mo
                  </span>
                </div>
                <ul className="mb-6 space-y-2 text-indigo-100">
                  <li className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="">Unlimited Support</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="">Live Video call</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                        className=""
                      ></path>
                    </svg>
                    <span className="">Diet and Workout Setup</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="">Priority Support</span>
                  </li>
                </ul>
                <Link href="/user/trainer">
                  <Button className="block px-8 text-sm font-semibold text-center text-white transition duration-100 bg-white rounded-lg outline-none bg-opacity-20 hover:bg-opacity-30 md:text-base">
                    Show trainers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userpage;
