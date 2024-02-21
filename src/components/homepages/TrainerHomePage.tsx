"use client";

import axiosInstance from "@/axios/creatingInstance";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface Trainer {
  description: string;
  email: string;
  experience: number;
  isBlocked: boolean;
  mobileNumber: number;
  name: string;
  price: number;
  profilePicture: string;
  publicId: string;
  specializedIn: string;
  _id: string;
}

const TrainerHomePage = () => {
  const [trainerData, setTrainerData] = useState<Trainer | null>(null);

  useEffect(() => {
    // Fetch data from the server
    const fetchTrainerData = () => {
      axiosInstance
        .get("trainer/profile")
        .then((res) => {
          console.log("res.data.trainer", res.data.trainer);
          setTrainerData(res.data.trainer);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchTrainerData();
  }, []);

  return (
    <div>
      {/* <h1>Trainer Id: {trainerData?._id}</h1>
      <h1>Description: {trainerData?.description}</h1>
      <h1>Email: {trainerData?.email}</h1>
      <h1>Experience: {trainerData?.experience}</h1>
      <h1>Is Blocked: {trainerData?.isBlocked.toString()}</h1>
      <h1>Mobile Number: {trainerData?.mobileNumber}</h1>
      <h1>Name: {trainerData?.name}</h1>
      <h1>Price: {trainerData?.price}</h1>
      <h1>Profile Picture: {trainerData?.profilePicture}</h1>
      <h1>Public Id: {trainerData?.publicId}</h1>
      <h1>Specialized In: {trainerData?.specializedIn}</h1> */}

      <div className="bg-blue-400 min-h-screen w-full relative">
        <div className="md:flex md:justify-center">
          <div className="p-3 md:w-10/12">
            <img
              className="md:w-full"
              src="/images/trainercover.png"
              alt="cover"
            />
          </div>
        </div>

        <div className="flex justify-center absolute w-11/12 top-60 left-5 md:top-3/4 md:left-20">
          <div className="md:w-9/12">
            <div className="bg-[#081E31] p-3 rounded-3xl w-full">
              <div className="flex justify-center">
                <div>
                  <h1 className="text-2xl font-semibold md:text-4xl md:p-5 md:tracking-wide">JOHN ABRAHAM</h1>
                  <p className="text-center font-light text-sm md:text-xl">
                    FITNESS TRAINER
                  </p>
                </div>
              </div>

              <div className="flex mt-8 gap-2 md:gap-24 justify-center">
                <div className="bg-slate-200 p-3 rounded-3xl md:p-10">
                  <h1 className="text-black text-center p-2 text-4xl md:text-7xl">5</h1>
                  <h3 className="text-black text-sm p-1 md:text-2xl">EXPERIENCE</h3>
                </div>
                <div className="bg-slate-200 p-3 rounded-3xl px-6 md:p-10 md:px-16">
                  <h1 className="text-black text-center p-2 text-4xl md:text-7xl">20</h1>
                  <h3 className="text-black text-sm p-1 md:text-2xl">CLIENTS</h3>
                </div>
                <div className="bg-slate-200 p-3 rounded-3xl md:p-10">
                  <h1 className="text-black text-center p-2 text-4xl md:text-7xl">10</h1>
                  <h3 className="text-black text-sm p-1 md:text-2xl">CERTIFICATE</h3>
                </div>
              </div>

              <div className="text-sm font-light p-4 tracking-normal leading-relaxed text-slate-200 mt-8 md:text-xl md:px-52">
                <p className="">
                  Hello! I'm Maya - your friendly virtual trainer here to help
                  you smash your health and fitness goals using the FitGo app.
                  Nice to meet you! <br />
                </p>
                  <div className="mt-2 md:mt-8">
                    As your personal guide, I will be customizing workout plans
                    and providing tailored guidance specifically for your needs.
                    My specialty is creating science-based fitness programs that
                    are both effective AND enjoyable. I'm here to help you get
                    the
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* add Certificate */}


      
    </div>
  );
};

export default TrainerHomePage;
