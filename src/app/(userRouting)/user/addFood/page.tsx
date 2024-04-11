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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

import { DietFoodType } from "@/types/FoodTypes";
import { HttpStatusCode } from "@/types/HttpStatusCode";

const Page = () => {
  const user = userStore((state) => state.user);
  const client_Id = user.UserId;
  const [latestDiet, setLatestDiet] = useState<DietFoodType[]>([]);
  const [listOpen, setListOpen] = useState(false);

  const [done, setDone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [schedule, setSchedule] = useState({
    foodId: "",
    timePeriod: "morning",
    quantity: "1",
    time: "10:00",
  });

  const [ScheduleError, setScheduleError] = useState({
    time: "",
  });

  useEffect(() => {
    // console.log(client_Id);
    axiosInstance
      .get(`/food/client/${client_Id}`)
      .then((res) => {
        // console.log("res.data.latestDiet", res.data.latestDiet);
        setLatestDiet(res.data.latestDiet);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }, [client_Id, done]);

  const updateParent = () => {
    setDone(!done);
  };
  const handleChange = (name: string, value: string | null) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const hour = parseInt(schedule.time.split(":")[0]);
    console.log(hour);

    if (schedule.timePeriod === "morning" && hour > 11) {
      setScheduleError((prevError) => ({
        ...prevError,
        time: "Time should be before 12:00 pm",
      }));
      return;
    } else if (
      schedule.timePeriod === "afternoon" &&
      (hour < 11 || hour >= 17)
    ) {
      setScheduleError((prevError) => ({
        ...prevError,
        time: "Time should be between 12:00 pm and 6:00 pm",
      }));
      return;
    } else if (schedule.timePeriod === "evening" && (hour < 17 || hour >= 23)) {
      setScheduleError((prevError) => ({
        ...prevError,
        time: "Time should be between 6:00 pm and 11:00 pm",
      }));
      return;
    } else {
      setScheduleError({
        time: "",
      });
      try {
        axiosInstance
          .put(`/food/addTimeDetails/${client_Id}/${schedule.foodId}`, schedule)
          .then((res) => {
            console.log(res.data);
            if (res.status === HttpStatusCode.OK) {
              setDone(!done);
              setIsOpen(false);
            }
          })
          .catch((err) => {
            console.log(err.response.data);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRemove = () => {
    // console.log(foodId, client_Id);
    try {
      axiosInstance
        .delete(`/food/deletePerFood/${client_Id}/${schedule.foodId}`)
        .then((res) => {
          if (res.status === HttpStatusCode.OK) {
            // console.log(res.data);
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

  const UpdateExistingDiet = () => {
    try {
      axiosInstance
        .put("/food/updateExisting", {
          client_Id,
        })
        .then((res) => {
          console.log("response form the update existing diet==========", res);
        })
        .catch((err) => {
          console.log("error in updating existing diet", err);
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

        <p className="text-center font-thin pb-3 italic">
          Note &quot;It would reflect in your next diet plan&quot;
        </p>
        <div className="flex justify-end">
          <Button onClick={UpdateExistingDiet} variant={"ghost"}>
            Update Existing Diet
          </Button>
        </div>
        <div className=" p-5 h-4/6 rounded-2xl shadow-2xl shadow-slate-800 overflow-y-scroll scrollbar-none scrollbar-thumb-slate-600 scrollbar-track-slate-950">
          {latestDiet.map((food) => {
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
                      alt={food.foodId.foodname}
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
                    <Button
                      onClick={() => {
                        console.log(food._id);
                        setSchedule({
                          foodId: food._id,
                          timePeriod: food.timePeriod,
                          quantity: food.quantity,
                          time: food.time,
                        });
                        setIsOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          <Dialog
            open={isOpen}
            onOpenChange={(isOpen) => {
              setIsOpen(isOpen);
              setScheduleError({
                time: "",
              });
            }}
          >
            <DialogContent className="sm:max-w-[425px] bg-black">
              <DialogHeader>
                <DialogTitle>Edit</DialogTitle>
                <DialogDescription>Add Time details</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time Period
                  </Label>
                  <select
                    className="text-black p-1 w-32 rounded-md"
                    name="timePeriod"
                    value={schedule.timePeriod}
                    onChange={(event) =>
                      handleChange("timePeriod", event.target.value)
                    }
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
                    value={schedule.quantity}
                    min={1}
                    onChange={(event) =>
                      handleChange("quantity", event.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Time
                  </Label>

                  <TimePicker
                    className={"text-gray-600 p-2 w-52 rounded-md bg-white"}
                    onChange={(value) => handleChange("time", value)}
                    value={schedule.time}
                  />
                </div>
                {ScheduleError && ScheduleError.time && (
                  <div>
                    <p className="text-red-500">{ScheduleError.time}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => handleSubmit()}>Save changes</Button>
                <Button onClick={() => handleRemove()}>Remove</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

export default Page;
