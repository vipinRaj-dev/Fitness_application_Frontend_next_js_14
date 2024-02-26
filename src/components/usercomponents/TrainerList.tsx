"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";

type Trainer = {
  _id: number;
  name: string;
  email: string;
  experience: number;
  specializedIn: string;
  description: string;
  profilePicture: string;
  price: number;
};

const TrainerList = () => {
  const [trainerList, setTrainerList] = useState<Trainer[]>([]);

  useEffect(() => {
    console.log("TrainerList from user side");
    const getTrainer = () => {
      axiosInstance
        .get("/user/getAllTrainers")
        .then((res) => {
          console.log(res.data.trainers);
          setTrainerList(res.data.trainers);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getTrainer();
  }, []);
  return (
    <div className="md:p-10 p-2 mt-10">
      <div className="">
        {/* <h1 className="text-xl font-semibold tracking-wide mt-5">Filter</h1>
        <div className="flex gap-3">
          <Input type="text" placeholder="Search by name" />
          <Input type="text" placeholder="Search by Specialization" />
          <Input type="text" placeholder="Search by Experience" />
          <Button type="submit">Filter</Button>
        </div> */}
        <div className="flex w-full max-w-sm items-center space-x-2 md:max-w-full">
          <Input type="text" placeholder="Search . . . " />
          <Button type="submit">Search</Button>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-semibold tracking-wide mt-5">Trainers</h1>
      </div>
      {trainerList.map((trainer) => {
        return (
          <div className="bg-slate-800 mt-5 w-full h-28 flex justify-between rounded-2xl p-2 md:px-16">
            <div className="flex gap-3 md:space-x-9" key={trainer._id}>
              <div className="w-16 h-16 rounded-full overflow-hidden my-auto ">
                <img
                  className="object-cover"
                  src={trainer.profilePicture}
                  alt="traer profile picture"
                />
              </div>
              <div className="text-sm leading-loose md:flex">
                <div>
                  <h1 className="text-xl font-semibold tracking-wide">
                    {trainer.name}
                  </h1>
                  <h1 className="opacity-55 font-light">
                    {trainer.specializedIn}
                  </h1>
                  <h1 className="opacity-55 font-light">
                    {trainer.experience} years of Experience
                  </h1>
                </div>
                <div className="md:w-96 md:overflow-hidden md:ml-20 md:h-20">
                  <h1 className="opacity-55 font-light hidden md:block">
                    {trainer.description}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center p-2">
              <div>
                <Link href={`/user/trainer/${trainer._id}`}>
                  <Button className="bg-blue-700 text-white" size={"sm"}>
                    Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainerList;
