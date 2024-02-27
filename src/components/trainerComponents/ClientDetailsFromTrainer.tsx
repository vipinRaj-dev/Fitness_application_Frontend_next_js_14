"use client";

import axiosInstance from "@/axios/creatingInstance";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { late, string } from "zod";
import { DialogClose } from "@radix-ui/react-dialog";

type User = {
  admissionNumber: number;
  email: string;
  healthIssues: {
    BloodPressure: number;
    Diabetes: number;
    HeartDisease: boolean;
    KidneyDisease: boolean;
    LiverDisease: boolean;
    Others: boolean;
    Thyroid: boolean;
    cholesterol: number;
    _id: string;
  };
  height: number;
  mobileNumber: number;
  name: string;
  profileImage: string;
  trainerPaymentDetails: string[];
  trainerPaymentDueDate: string;
  userBlocked: boolean;
  weight: number;
  _id: string;
};

const ClientDetailsFromTrainer = ({ client_Id }: { client_Id: string }) => {
  const [clientDetails, setClientDetails] = useState<User | null>(null);
  const [latestFoodByTrainer, setLatestFoodByTrainer] = useState<any[]>([]);
  const [done, setDone] = useState(false);

  const [state, setState] = useState({
    timePeriod: "morning",
    quantity: 0,
    time: "10:00",
  });

  useEffect(() => {
    // console.log(client_Id);

    axiosInstance
      .get(`/trainer/client/${client_Id}`)
      .then((res) => {
        // console.log(res.data.latestFoodByTrainer);
        setClientDetails(res.data);
        setLatestFoodByTrainer(res.data.latestFoodByTrainer);
      })
      .catch((err) => {
        // console.log(err.response.data);
      });
  }, [client_Id, done]);
  // console.log(clientDetails);
  console.log(latestFoodByTrainer);

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name;
    if (!name) {
      return;
    }

    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleSubmit = async (foodId: string) => {
    console.log(foodId, client_Id);
    try {
      axiosInstance
        .put(`/trainer/addTimeDetails/${client_Id}/${foodId}`, state)
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            setDone(!done);
          }
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* ClientDetailsFromTrainer {client_Id} */}
      <div className="bg-white h-screen md:flex w-full ">
        <div className="bg-red-300 md:w-1/2 flex md:flex md:flex-col w-full h-1/2 md:h-full">
          <div className="bg-blue-300 md:h-1/2 w-1/2 md:w-full  ">
            {clientDetails && (
              <div className="p-3 text-black bg-white m-2 mt-12  rounded-3xl text-xs leading-relaxed">
                <div className="mb-2">
                  <img
                    className="h-20 object-cover rounded-full w-20"
                    src={clientDetails.profileImage}
                    alt=""
                  />
                </div>
                <div className="text-xl font-semibold tracking-wide">
                  {clientDetails.name}
                </div>
                <div className="flex">
                  <p>Adm.No : </p>
                  <p>{clientDetails.admissionNumber}</p>
                </div>

                <div className="flex">
                  <p>Weight : </p>
                  {clientDetails.weight}
                </div>
                <div className="flex">
                  <p>Height : </p>
                  {clientDetails.height}
                </div>
                <div className="flex">
                  <p>Mob.No : </p>
                  {clientDetails.mobileNumber}
                </div>

                <div className="flex">
                  <p>Email: </p>
                  {clientDetails.email}
                </div>

                <div className="flex">
                  <p className="text-sm">Health Issues </p>
                </div>
                <div className="ml-10">
                  {Object.entries(clientDetails.healthIssues).map(
                    ([key, value]) => {
                      if (key !== "_id" && value && value !== 0) {
                        return (
                          <div key={key}>
                            {key}: {value === true ? "Yes" : value.toString()}
                          </div>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="bg-black md:h-1/2 w-1/2 md:w-full ">calander</div>
        </div>

        <div className="bg-pink-400 md:w-1/2 h-1/2 md:h-full w-full">
          report
        </div>
      </div>
      <div className="h-screen bg-slate-500">
        <div>
          <Link href={`/trainer/addDiet/${client_Id}`}>
            <Button>Add Food</Button>
          </Link>
        </div>
        <div>
          {latestFoodByTrainer.map((food: any, index) => {
            return (
              <div key={food._id}>
                <h1>{index + 1}</h1>

                <h1>{food.foodId.foodname}</h1>
                <h1>{food.foodId.description}</h1>
                <div>
                  <h3>Ingredients</h3>
                  {food.foodId.ingredients.map((ingredient: string) => {
                    return (
                      <div>
                        <p key={ingredient}>{ingredient}</p>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <h3>Nutrition</h3>
                  {Object.entries(food.foodId.nutrition).map(([key, value]) => {
                    if (key !== "_id" && value && value !== 0) {
                      return (
                        <div>
                          <p key={key}>
                            {key}: {value.toString()}
                          </p>
                        </div>
                      );
                    }
                  })}
                </div>
                <div>
                  {
                    <div>
                      <p>Quantity</p>
                      <p>{food.quantity}</p>
                      <p>Time</p>
                      <p>{food.time}</p>
                      <p>Time Period</p>
                      <p>{food.timePeriod}</p>
                    </div>
                  }
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit</DialogTitle>
                      <DialogDescription>Add Time details</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          Name
                        </Label>
                        <select
                          className="text-black"
                          name="timePeriod"
                          value={state.timePeriod}
                          onChange={handleChange}
                        >
                          <option value="morning">morning</option>
                          <option value="afternoon">afternoon</option>
                          <option value="evening">evening</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Quantity
                        </Label>
                        <Input
                          type="number"
                          name="quantity"
                          value={state.quantity}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Time
                        </Label>
                        <input
                          type="time"
                          name="time"
                          onChange={handleChange}
                          value={state.time}
                          className="w-full placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button onClick={() => handleSubmit(food._id)}>
                          Save changes
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsFromTrainer;
