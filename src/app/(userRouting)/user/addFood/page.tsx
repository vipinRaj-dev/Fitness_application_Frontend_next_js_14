"use client";

import axiosInstance from "@/axios/creatingInstance";
import FoodSearch from "@/components/trainerComponents/FoodSearch";
import { Button } from "@/components/ui/button";
import { userStore } from "@/store/user";
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
import { DialogClose } from "@radix-ui/react-dialog";

import { useEffect, useState } from "react";

const page = () => {
  const user = userStore((state) => state.user);
  const client_Id = user.UserId;
  const [latestDiet, setLatestDiet] = useState<any[]>([]);
  const [listOpen, setListOpen] = useState(false);

  const [done, setDone] = useState(false);

  const [state, setState] = useState({
    timePeriod: "morning",
    quantity: 0,
    time: "10:00",
  });

  useEffect(() => {
    // console.log(client_Id);
    axiosInstance
      .get(`/food/client/${client_Id}`)
      .then((res) => {
        console.log("res.data.latestDiet", res.data.latestDiet);
        setLatestDiet(res.data.latestDiet);
      })
      .catch((err: Error | any) => {
        console.log(err.response.data);
      });
  }, [client_Id, done]);

  const updateParent = () => {
    setDone(!done);
  };

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
        .put(`/food/addTimeDetails/${client_Id}/${foodId}`, state)
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
        .delete(`/food/deletePerFood/${client_Id}/${foodId}`)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setDone(!done);
            // setLatestDiet(latestDiet.filter(food => food._id !== foodId));
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
      <div className=" p-5 h-screen ">
        <h1 className="text-center font-semibold pt-5 text-2xl">
          Edit next diet plan
        </h1>
        <p className="text-center font-thin pb-3 italic">Note :"It would reflect in your next diet plan"</p>
        <div className=" p-5 h-4/6 rounded-2xl shadow-2xl shadow-slate-800 overflow-y-scroll scrollbar-none scrollbar-thumb-slate-600 scrollbar-track-slate-950">
          {latestDiet.map((food: any, index) => {
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
        <div className="flex justify-end mt-28">
          <Button
            onClick={() => {
              setListOpen(!listOpen);
            }}
          >
            {listOpen ? "close" : "Add New Food"}
          </Button>
        </div>
      </div>

      {listOpen && (
        <FoodSearch clientId={client_Id} updateParent={updateParent} />
      )}
    </div>
  );
};

export default page;
