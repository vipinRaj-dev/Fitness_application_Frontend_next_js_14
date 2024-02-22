"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

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
    <div>
      TrainerList from user side listing the trainer
      {trainerList.map((trainer) => {
        return (
          <div className="p-5" key={trainer._id}>
            <h1>name : {trainer.name}</h1>
            <h1>email : {trainer.email}</h1>
            <h1>experience : {trainer.experience}</h1>
            <h1>specializedIn : {trainer.specializedIn}</h1>
            <h1>description : {trainer.description}</h1>
            <h1>price : {trainer.price}</h1>
            <div>
              <Link href={`/user/trainer/${trainer._id}`}>
                <Button>View Trainer</Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainerList;
