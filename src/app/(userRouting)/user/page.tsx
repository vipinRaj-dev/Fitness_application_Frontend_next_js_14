"use client";

import { baseUrl } from "@/Utils/PortDetails";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Cookies from "js-cookie";
import { loadStripe } from "@stripe/stripe-js";
import AreaChartPlot from "@/components/recharts/AreaChartPlot";
import PieChartPlot from "@/components/recharts/PieChartPlot";
import BarChartPlot from "@/components/recharts/BarChartPlot";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";
import FoodCard from "@/components/usercomponents/FoodCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/axios/creatingInstance";
import HomePageWorkout from "@/components/usercomponents/HomePageWorkout";

import { BarChartData } from "@/components/recharts/BarChartPlot";
import BarChartUser, {
  BarChartDataUser,
} from "@/components/recharts/BarChartUser";

type DietFood = {
  time: string;
}[];

type graphOrder = {
  [key: string]: number;
};

const Userpage = () => {
  const [latestDiet, setLatestDiet] = useState<DietFood>([]);
  const [addedFoodDocIds, setAddedFoodDocIds] = useState<string[]>([]);
  const [hasTrainer, setHasTrainer] = useState(false);
  const [attendanceId, setAttendanceId] = useState<string>("");

  const [AttandanceGraph, setAttandanceGraph] = useState<BarChartData[] | null>(
    null
  );

  const [foodStatus, setFoodStatus] = useState<BarChartDataUser[] | null>(null);
  const router = useRouter();

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
        console.log(res.data);

        const barData = res.data.attendancePerDay
          .sort(
            (a: { day: string }, b: { day: string }) =>
              orderOfWeek[a.day] - orderOfWeek[b.day]
          )
          .map((item: any) => ({
            day: item.day,
            NoOfDays: item.NoOfDays,
          }));

        setAttandanceGraph(barData);

        const foodStatus = res.data.foodStatusData
          .sort(
            (a: { _id: string }, b: { _id: string }) =>
              orderOfFood[a._id] - orderOfFood[b._id]
          )
          .map((item: any) => ({
            name: item._id,
            FoodCount: item.totalFood,
            ConsumedFood: item.completedCount,
          }));
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
          // console.log(res.data);
          if (res.status === 200) {
            setLatestDiet(res.data.dietFood);
            setAddedFoodDocIds(res.data.addedFoodDocIds);
            setHasTrainer(res.data.hasTrainer);
            setAttendanceId(res.data.attendanceDocId);
            getAllGraphData();
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
    fetchUser();
  }, []);

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

      <div className=" w-full h-screen p-1 mt-10 md:mt-36">
        <div className="h-3/6  gap-5 md:flex md:justify-evenly">
          <div className="flex justify-center">
            <div className="w-3/4">
              <img src="/images/bmi.png" alt="bmi" />
            </div>
          </div>

          <div className="p-2 mt-3 flex md:flex-col md:items-center md:justify-center md:space-y-9 ">
            <div className="text-sm font-semibold md:font-bold md:text-4xl">
              The hard days are the best <br /> because that's when <br />
              champions are made
            </div>

            <div className="flex items-center p-2">
              <Button className="md:px-10 md:font-semibold ">CHECK BMI</Button>
            </div>
          </div>
        </div>

        <div className="h-3/6  md:flex md:justify-evenly md:items-center">
          <div className="mt-3 hidden md:block">
            <h1 className="text-xl font-semibold px-5 md:text-5xl md:font-bold md:tracking-wide md:leading-normal">
              The <br /> body achieves <br /> what the mind believes
            </h1>
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
                  .map((food: any) => {
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
                  .map((food: any) => {
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
                  .map((food: any) => {
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

      <div id="purchasePlan">
        pricing plan
        <div className=" p-10">
          <div className="flex flex-wrap items-center justify-center max-w-4xl mx-auto gap-4 sm:gap-0">
            <div className="w-full p-6 bg-black border border-gray-700 rounded-lg sm:w-1/2 bg-opacity-20 sm:rounded-r-none sm:p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold jakarta text-gray-100 sm:text-4xl">
                  Free Plan
                </h3>
              </div>
              <div className="mb-4 space-x-2">
                <span className="text-4xl font-bold text-gray-100">$0/mo</span>
              </div>
              <ul className="mb-6 space-y-2 text-gray-300">
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
                  <span className="">One Project</span>
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
                  <span className="">Limited Designs</span>
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
                  <span className="">Basic Settings</span>
                </li>
              </ul>
              <a
                href="#"
                className="block px-8 py-3 text-sm font-semibold text-center text-gray-100 transition duration-100 bg-white rounded-lg outline-none bg-opacity-10 hover:bg-opacity-20 md:text-base"
              >
                Get Started for Free
              </a>
            </div>

            <div className="w-full p-6 rounded-lg shadow-xl sm:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 sm:p-8">
              <div className="flex flex-col items-start justify-between gap-4 mb-6 lg:flex-row">
                <div>
                  <h3 className="text-2xl font-semibold text-white jakarta sm:text-4xl">
                    Pro Plan
                  </h3>
                </div>
                <span className="order-first inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase bg-black rounded-full lg:order-none bg-opacity-20">
                  Go Pro
                </span>
              </div>
              <div className="mb-4 space-x-2">
                <span className="text-4xl font-bold text-white">$15/mo</span>
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
                  <span className="">Unlimited Projects</span>
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
                  <span className="">Unlimited API calls</span>
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
                  <span className="">Advanced Project Settings</span>
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
    </div>
  );
};

export default Userpage;
