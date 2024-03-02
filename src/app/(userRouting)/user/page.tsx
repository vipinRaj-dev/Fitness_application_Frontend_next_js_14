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
import { useEffect, useState } from "react";
import axiosInstance from "@/axios/creatingInstance";

const Userpage = () => {
  const [latestDiet, setLatestDiet] = useState([]);
  const [addedFood, setAddedFood] = useState<string[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      axiosInstance
        .get("/user/homePage")
        .then((res) => {
          console.log(res.data);
          setLatestDiet(res.data.latestDiet);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchUser();
    const fetchFoodLog = async () => {
      axiosInstance
        .get("/user/getFoodLog")
        .then((res) => {
          console.log(res.data.arrayOfFoods);
          setAddedFood(res.data.arrayOfFoods);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchFoodLog();
  }, []);

  const makePayment = async () => {
    // console.log("payment done");

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
    );

    const body = {
      amount: 2500,
      plan: "premium",
    };
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${Cookies.get("jwttoken")}`,
    };

    const response = await fetch(`${baseUrl}/user/create-checkout-session`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const session = await response.json();
    if (stripe) {
      const result: any = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        console.log(result.error.message);
      }
    }
  };

  return (
    <div className="">
      <div className="flex justify-end p-3">
        <h1 className="mx-2">Workouting</h1>
        <Switch className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500" />
      </div>

      {/* <div className="w-full flex flex-wrap md:gap-5 md:justify-center ">
        <div className="w-full md:w-4/12 h-96 mt-8 bg-slate-900 md:rounded-3xl rounded-xl">
          <h1 className="font-semibold text-center">Attandance</h1>
          <div className="h-full w-full pb-10">
            <AreaChartPlot />
          </div>
        </div>

        <div className="w-full md:w-3/12 h-96 mt-8 bg-slate-900 md:rounded-3xl rounded-xl p-2">
          <h1 className="font-semibold text-center">Attandance</h1>
          <PieChartPlot />
        </div>

        <div className="w-full md:w-4/12 h-96 mt-8 bg-slate-900 md:rounded-3xl rounded-xl p-2">
          <h1 className="font-semibold text-center">Attandance</h1>
          <BarChartPlot />
        </div>
      </div> */}

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
        <div className="flex justify-between py-8">
          <div>
            <h1 className="text-4xl font-semibold">Diet</h1>
          </div>
          {/* <div>
            <Button>Add Food</Button>
          </div> */}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="md:flex md:justify-around">
          <div>
            <h1 className="text-2xl">Morning</h1>
            <div className="h-screen  space-y-3 overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
              {latestDiet &&
                latestDiet.map((food: any, index) => {
                  if (food.timePeriod === "morning")
                    return (
                      <FoodCard
                        key={food._id}
                        details={food}
                        addedFood={addedFood}
                      />
                    );
                })}
            </div>
          </div>
          <div>
            <h1 className="text-2xl">Noon</h1>
            <div className="h-screen  space-y-3 overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
              {latestDiet &&
                latestDiet.map((food: any, index) => {
                  if (food.timePeriod === "afternoon")
                    return (
                      <FoodCard
                        key={food._id}
                        details={food}
                        addedFood={addedFood}
                      />
                    );
                })}
            </div>
          </div>
          <div>
            <h1 className="text-2xl">Evening</h1>
            <div className="h-screen  space-y-3 overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
              {latestDiet &&
                latestDiet.map((food: any, index) => {
                  if (food.timePeriod === "evening")
                    return (
                      <FoodCard
                        key={food._id}
                        details={food}
                        addedFood={addedFood}
                      />
                    );
                })}
            </div>
          </div>
        </div>
      </div>

      <h1>plan details</h1>

      <div>dumbel image</div>
      <div>excersice plan</div>
      <div>
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
