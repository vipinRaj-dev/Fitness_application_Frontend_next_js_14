"use client";

import axiosInstance from "@/axios/creatingInstance";

import { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
  const router = useRouter();
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
      .catch((err: Error | any) => {
        console.log(err.response.data);
        if (err.response.status === 404) {
          Cookies.remove("jwttoken");
          router.replace("/sign-in");
        }
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
          if (res.status === 200) {
            console.log(res.data);
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

  const handleRemove = (foodId: string) => {
    console.log(foodId, client_Id);
    try {
      axiosInstance
        .delete(`/trainer/singleFoodDelete/${client_Id}/${foodId}`)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setDone(!done);
            // setLatestFoodByTrainer(latestFoodByTrainer.filter(food => food._id !== foodId));
          }
        })
        .catch((err) => {
          console.log(err);
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

        <div className="bg-black md:w-1/2 h-1/2 md:h-full w-full">report</div>
      </div>

      <div className="h-screen p-10 ">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-wide">
              Schedule Diet
            </h1>
          </div>
          <div>
            <Link href={`/trainer/addDiet/${client_Id}`}>
              <Button>Add Food</Button>
            </Link>
          </div>
        </div>
        <div className="mt-5 mb-20 relative">
          <div className="absolute w-full h-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>
        <div className=" p-5 h-5/6overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
          {latestFoodByTrainer.map((food: any, index) => {
            return (
              <div
                className="flex gap-2 mb-4 h-36 p-3 bg-[#2C2C2E] rounded-lg justify-between items-center"
                key={food._id}
              >
                <div className="flex items-center gap-3 h-full w-80">
                  <div className="rounded-3xl w-32  overflow-hidden">
                    <img
                      className="w-full h-full object-contain "
                      src={food.foodId.photoUrl}
                      alt={food.foodId.name}
                    />
                  </div>
                  <div className="flex items-center">
                    <h1>{food.foodId.foodname}</h1>
                  </div>
                </div>

                <div>
                  {food && food.foodId.nutrition ? (
                    Object.entries(food.foodId.nutrition).map(
                      ([key, value]) => {
                        if (typeof value === "number" && value !== 0) {
                          return (
                            <div key={key}>
                              <h1>
                                {key} : {value}
                              </h1>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      }
                    )
                  ) : (
                    <p>No nutrition information available.</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <div>
                    {
                      <div>
                        <div className="flex">
                          <p>Quantity : </p>
                          <p>{food.quantity}</p>
                        </div>
                        <div className="flex">
                          <p>Time : </p>
                          <p>{food.time}</p>
                        </div>
                        <div className="flex">
                          <p>Time Period : </p>
                          <p>{food.timePeriod}</p>
                        </div>
                      </div>
                    }
                  </div>
                  <div className="flex items-center px-5">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className=" bg-black" variant="outline">
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-black">
                        <DialogHeader>
                          <DialogTitle>Edit</DialogTitle>
                          <DialogDescription>
                            Add Time details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="time" className="text-right">
                              Name
                            </Label>
                            <select
                              className="text-black p-1 w-32 rounded-md"
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
                              className="text-white p-2 w-32 "
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
                              className="w-full placeholder-gray-500 p-1 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button onClick={() => handleSubmit(food._id)}>
                              Save changes
                            </Button>
                          </DialogClose>
                          <Button onClick={() => handleRemove(food._id)}>
                            Remove
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsFromTrainer;
