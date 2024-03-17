"use client";
import axiosInstance from "@/axios/creatingInstance";
import Dnaspinner from "@/components/loadingui/Dnaspinner";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import Link from "next/link";
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

import { AttendanceData } from "@/types/DateWiseResponseData";

type FormState = {
  _id: string;
  name: string;
  email: string;
  mobileNumber: number;
  weight: number;
  height: number;
  profileImage: File | string;
  BloodPressure: number;
  Diabetes: number;
  cholesterol: number;
  HeartDisease: boolean;
  KidneyDisease: boolean;
  LiverDisease: boolean;
  Thyroid: boolean;
};

const UserProfile = () => {
  const router = useRouter();
  const timePeriods = ["morning", "afternoon", "evening"];

  const [date, setDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [userCreatedDate, setUserCreatedDate] = useState<Date>();

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

  type error = {
    mobileNumber?: string;
    height?: string;
    weight?: string;
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await axiosInstance
          .get("user/profile")
          .then((res) => {
            setForm((prevState) => ({
              ...prevState,
              ...res.data.user,
              ...res.data.user.healthIssues,
            }));
            let userCreated = new Date(res.data.user.createdAt);
            userCreated.setHours(0, 0, 0, 0);
            setUserCreatedDate(userCreated);
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

  const [errors, setErrors] = useState<error>({});
  const [loading, setLoading] = useState(false);
  const [openInput, setOpenInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
    if (type === "checkbox") {
      setForm((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (name === "image") {
      setForm((prevState) => ({
        ...prevState,
        [name]: e.target.files ? e.target.files[0] : prevState.profileImage,
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true);

    console.log(form);
    if (
      form.mobileNumber.toString().length < 10 ||
      form.mobileNumber.toString().length > 10
    ) {
      setErrors((prevState) => ({
        ...prevState,
        mobileNumber: "Mobile Number should be 10 digit",
      }));
    } else if (
      form.height.toString().length > 3 ||
      form.height.toString().length < 1
    ) {
      setErrors((prevState) => ({
        ...prevState,
        height: "Height should be less than 3 digit",
      }));
    } else if (
      form.weight.toString().length > 3 ||
      form.weight.toString().length < 1
    ) {
      console.log("weight error");
      setErrors((prevState) => ({
        ...prevState,
        weight: "Weight should be less than 3 digit",
      }));
    } else {
      console.log("form send");
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await axiosInstance
        .put("/user/profileUpdate", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // console.log(res.data);
          setLoading(false);
          if (res.status === 200) {
            setForm((prevState) => ({
              ...prevState,
              profileImage: res.data?.imageData?.url,
            }));
            swal({
              title: "seccess!",
              text: "Updated succesfully",
              icon: "success",
            });
          } else {
            swal({
              title: "Profile Not Updated",
              text: "Your profile has not been updated",
              icon: "error",
            });
          }
        })
        .catch((err: Error | any) => {
          setLoading(false);
          console.log(err.response.data);
          swal({
            title: "warning!",
            text: err.response.data.msg,
            icon: "warning",
          });
        });
    }
  };

  const openHealthIssues = () => {
    setOpenInput(true);
  };

  const setDateToStart = (date: Date | number) => {
    let newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  if (loading) {
    return <Dnaspinner />;
  }

  return (
    <div>
      <div className="md:flex w-full">
        <div className="md:w-2/6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center min-h-96 py-2"
          >
            <div className="flex flex-col bg-slate-900 p-20 rounded-xl shadow-2xl w-full md:w-full lg:w-9/12 space-y-6">
              <div className="flex justify-center ">
                {form.profileImage && (
                  <img
                    className="rounded-3xl border-2 border-slate-500"
                    src={
                      typeof form.profileImage === "string"
                        ? form.profileImage
                        : "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                    }
                    width={300}
                    alt=""
                  />
                )}
              </div>

              {/* <Image src='http://res.cloudinary.com/dxxbvjmz5/image/upload/v1707805602/user-Images/x74bkkb3btxdeexaeyol.png' alt="demoImage" width={100} height={100}></Image> */}
              <label>
                Image
                <input
                  name="image"
                  type="file"
                  onChange={handleInputChange}
                  className="rounded px-3 py-2 w-full"
                />
              </label>
              <h2 className="text-center text-xl font-extrabold">
                User Profile
              </h2>
              <label>
                Name
                <input
                  value={form.name}
                  name="name"
                  type="text"
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="rounded px-3 py-2 w-ful text-black"
                />
              </label>
              <label>
                Email
                <input
                  value={form.email}
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="rounded px-3 py-2 w-full  text-black"
                />
              </label>
              <label>
                Phone Number
                <input
                  value={form.mobileNumber}
                  name="mobileNumber"
                  type="number"
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="rounded px-3 py-2 w-full  text-black"
                />
                {errors.mobileNumber && (
                  <p className="text-red-600 text-xs">{errors.mobileNumber}</p>
                )}
              </label>
              <label>
                Weight
                <input
                  value={form.weight}
                  name="weight"
                  type="number"
                  onChange={handleInputChange}
                  placeholder="Weight"
                  className="rounded px-3 py-2 w-full  text-black"
                />
                {errors.weight && (
                  <p className="text-red-600 text-xs">{errors.weight}</p>
                )}
              </label>
              <label>
                Height
                <input
                  value={form.height}
                  name="height"
                  type="number"
                  onChange={handleInputChange}
                  placeholder="Height"
                  className="rounded px-3 py-2 w-full  text-black"
                />
                {errors.height && (
                  <p className="text-red-600 text-xs">{errors.height}</p>
                )}
              </label>

              <label>
                Do you have any health issues?{" "}
                <Badge onClick={openHealthIssues} variant="secondary">
                  Click to Add
                </Badge>
              </label>

              {openInput && (
                <>
                  <label>
                    Blood Pressure
                    <input
                      value={form.BloodPressure}
                      name="BloodPressure"
                      type="number"
                      onChange={handleInputChange}
                      placeholder="Blood Pressure"
                      className="rounded px-3 py-2 w-full  text-black"
                    />
                  </label>
                  <label>
                    Diabetes
                    <input
                      value={form.Diabetes}
                      name="Diabetes"
                      type="number"
                      onChange={handleInputChange}
                      placeholder="Diabetes"
                      className="rounded px-3 py-2 w-full  text-black"
                    />
                  </label>
                  <label>
                    cholesterol
                    <input
                      value={form.cholesterol}
                      name="cholesterol"
                      type="number"
                      onChange={handleInputChange}
                      placeholder="cholesterol"
                      className="rounded px-3 py-2 w-full  text-black"
                    />
                  </label>
                  <label>
                    Heart Disease
                    <input
                      checked={form.HeartDisease}
                      name="HeartDisease"
                      type="checkbox"
                      onChange={handleInputChange}
                      className="rounded px-3 py-2 w-full  text-black"
                    />
                  </label>
                  <label>
                    Kidney Disease
                    <input
                      checked={form.KidneyDisease}
                      name="KidneyDisease"
                      type="checkbox"
                      onChange={handleInputChange}
                      className="rounded px-3 py-2 w-full  text-black"
                    />
                  </label>
                  <label>
                    Liver Disease
                    <input
                      checked={form.LiverDisease}
                      name="LiverDisease"
                      type="checkbox"
                      onChange={handleInputChange}
                      className="rounded px-3 py-2 w-full  text-black"
                    />
                  </label>
                  <label>
                    Thyroid
                    <input
                      checked={form.Thyroid}
                      name="Thyroid"
                      type="checkbox"
                      onChange={handleInputChange}
                      className="rounded px-3 py-2 w-full  text-black"
                    />
                  </label>
                </>
              )}

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Update
              </button>
            </div>
          </form>
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
                    <TableBody className="bg-slate-800">
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
                    {workout.workoutSet.map((workoutSet, index) => (
                      <TableRow key={index}>
                        {index === 0 && (
                          <>
                            <TableCell
                              className="font-medium"
                              rowSpan={workout.workoutSet.length}
                            >
                              <Image
                                className="rounded-xl"
                                src={workout.workoutId.thumbnailUrl}
                                width={60}
                                height={60}
                                alt="workout image"
                              />
                            </TableCell>
                            <TableCell rowSpan={workout.workoutSet.length}>
                              {workout.workoutId.workoutName}
                            </TableCell>
                            <TableCell rowSpan={workout.workoutSet.length}>
                              {workout.workoutId.targetMuscle}
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          <h1> {workoutSet.weight}</h1>
                        </TableCell>
                        <TableCell>
                          <h1> {workoutSet.reps}</h1>
                        </TableCell>
                        <TableCell className="text-right">
                          <p>{workoutSet.completedReps}</p>
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
