"use client";
import axiosInstance from "@/axios/creatingInstance";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { Trainer } from "@/types/TrainerTypes";
import { AttendanceData } from "@/types/DateWiseResponseData";
import TrainerChatReview from "./TrainerChatReview";
import UserProfileEdit from "./UserProfileEdit";
import { FormState } from "@/types/UserTypes";
const UserProfile = () => {
  const router = useRouter();
  const timePeriods = ["morning", "afternoon", "evening"];

  const [date, setDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [userCreatedDate, setUserCreatedDate] = useState<Date>();

  const [trainer, setTrainer] = useState<Trainer>({
    profilePicture: "",
    name: "",
    _id: "",
    trainerPaymentDueDate: "",
  });

  const [attendanceData, setAttendanceData] = useState<AttendanceData>();

  const [form, setForm] = useState<FormState>({
    _id: "",
    name: "",
    email: "",
    mobileNumber: 0,
    weight: 0,
    height: 0,
    profileImage: "",
    BloodPressure: 0,
    Diabetes: 0,
    cholesterol: 0,
    HeartDisease: false,
    KidneyDisease: false,
    LiverDisease: false,
    Thyroid: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await axiosInstance
          .get("user/profile")
          .then((res) => {
            console.log("userDetails", res.data);

            setForm((prevState) => ({
              ...prevState,
              ...res.data.user,
              ...res.data.user.healthIssues,
            }));
            let userCreated = new Date(res.data.user.createdAt);
            userCreated.setHours(0, 0, 0, 0);
            setUserCreatedDate(userCreated);
            setTrainer({
              profilePicture: res.data.user.trainerId.profilePicture,
              name: res.data.user.trainerId.name,
              _id: res.data.user.trainerId._id,
              trainerPaymentDueDate: res.data.user.trainerPaymentDueDate,
            });
          })
          .catch((err) => {
            console.log("error inside the api call");
            console.log(err);
            if (err.response.status === 402) {
              console.log("purchase");
              router.replace("/user/subscription");
            }
          });
        // console.log(res.data.user);
      } catch (error) {
        console.log("error inside the fetchUser");
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (date) {
      console.log("date", date);
      console.log("userCreatedDate", userCreatedDate);

      axiosInstance
        .get(`user/getDate/${date}`)
        .then((res) => {
          // console.log(res.data);
          setAttendanceData(res.data.attandanceData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [date]);

  const setDateToStart = (date: Date | number) => {
    let newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  return (
    <div>
      <div className="md:flex w-full">
        <div className="md:w-2/6 p-1 ">
          <UserProfileEdit form={form} setForm={setForm} />

          {trainer.profilePicture && (
            <div>
              <TrainerChatReview trainer={trainer} userName={form.name} />
            </div>
          )}
        </div>

        <div className=" h-screen md:w-4/6 p-5">
          <div className="flex justify-end p-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-[240px] pl-3 text-left font-normal"
                >
                  {date ? date.toDateString() : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  showOutsideDays={false}
                  onDayClick={(day) => setDate(setDateToStart(day))}
                  selected={date}
                  disabled={(date) =>
                    date < (userCreatedDate ?? new Date()) || date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="m-5">
            <div className="flex justify-center pb-3">
              {attendanceData && attendanceData.isPresent ? (
                <Badge variant={"outline"} className="bg-green-500 p-2">
                  Present : {date && date.toDateString()}
                </Badge>
              ) : (
                <Badge className="bg-red-500 p-2">
                  Absent : {date && date.toDateString()}
                </Badge>
              )}
            </div>

            <div className="w-full h-36  flex justify-evenly">
              {timePeriods.map((period) => {
                const filteredLogs =
                  attendanceData &&
                  attendanceData.foodLogs.filter(
                    (log) => log.timePeriod === period && log.status === true
                  );
                const totalNutrition =
                  filteredLogs &&
                  filteredLogs.reduce(
                    (total, log) => {
                      return {
                        calories:
                          total.calories + log.foodId.nutrition.calories,
                        protein: total.protein + log.foodId.nutrition.protein,
                        carbs: total.carbs + log.foodId.nutrition.carbs,
                        fat: total.fat + log.foodId.nutrition.fat,
                      };
                    },
                    { calories: 0, protein: 0, carbs: 0, fat: 0 }
                  );

                return (
                  <div
                    key={period}
                    className="w-1/4 bg-slate-600 rounded-lg p-3"
                  >
                    <h1 className="text-xl font-semibold mb-1">{`${
                      period.charAt(0).toUpperCase() + period.slice(1)
                    } Meal`}</h1>
                    <h1>
                      Calories : {totalNutrition && totalNutrition.calories}
                    </h1>
                    <h1>
                      Protein : {totalNutrition && totalNutrition.protein}
                    </h1>
                    <h1>Carb : {totalNutrition && totalNutrition.carbs}</h1>
                    <h1>Fat : {totalNutrition && totalNutrition.fat}</h1>
                  </div>
                );
              })}

              {/* <div className="w-1/4 bg-slate-600 rounded-lg p-5">box</div>
              <div className="w-1/4 bg-slate-600 rounded-lg p-5">box</div> */}
            </div>
          </div>

          <div className=" rounded-lg h-2/6 overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
            <Table>
              <TableCaption className="p-5">Date wise Result</TableCaption>
              <TableHeader className="bg-black">
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Food Name</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              {attendanceData &&
                attendanceData?.foodLogs.map((data, index) => {
                  return (
                    <TableBody key={index} className="bg-slate-800">
                      <TableRow>
                        <TableCell className="font-medium">
                          {/* <img src={data.foodId.photoUrl} alt="food image" /> */}
                          <Image
                            className="rounded-xl"
                            src={data.foodId.photoUrl}
                            width={60}
                            height={60}
                            alt="food image"
                          />
                        </TableCell>
                        <TableCell>{data.foodId.foodname}</TableCell>
                        <TableCell>
                          <h1> {data.time}</h1>
                          <h1> {data.timePeriod}</h1>
                        </TableCell>
                        <TableCell className="text-right">
                          <p>{data.status ? "Taken" : "Not Taken"}</p>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  );
                })}
            </Table>
          </div>
          <div className=" rounded-lg h-3/6 overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
            <Table>
              <TableCaption className="">Date wise Result</TableCaption>
              <TableHeader className="">
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Workout Name</TableHead>
                  <TableHead>Target Muscle</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Reps</TableHead>
                  <TableHead className="text-right">completed Reps</TableHead>
                </TableRow>
              </TableHeader>
              {attendanceData &&
                attendanceData?.workOutLogs?.workOuts.map((workout, index) => (
                  <TableBody
                    key={index}
                    className="bg-slate-800 border-b-2 border-slate-600 "
                  >
                    {workout?.workoutSet.map((workoutSet, index) => (
                      <TableRow key={index}>
                        {index === 0 && (
                          <>
                            <TableCell
                              className="font-medium"
                              rowSpan={workout?.workoutSet.length}
                            >
                              <Image
                                className="rounded-xl"
                                src={workout?.workoutId?.thumbnailUrl}
                                width={60}
                                height={60}
                                alt="workout image"
                              />
                            </TableCell>
                            <TableCell rowSpan={workout?.workoutSet?.length}>
                              {workout?.workoutId?.workoutName}
                            </TableCell>
                            <TableCell rowSpan={workout.workoutSet.length}>
                              {workout?.workoutId?.targetMuscle}
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          <h1> {workoutSet?.weight}</h1>
                        </TableCell>
                        <TableCell>
                          <h1> {workoutSet?.reps}</h1>
                        </TableCell>
                        <TableCell className="text-right">
                          <p>{workoutSet?.completedReps}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
