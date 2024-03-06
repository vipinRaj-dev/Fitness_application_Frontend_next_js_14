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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

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

type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type FoodId = {
  foodname: string;
  foodtype: string;
  nutrition: Nutrition;
  photoUrl: string;
};

type FoodLog = {
  foodId: FoodId;
  quantity: string;
  status: boolean;
  time: string;
  timePeriod: string;
  updatedAt: string;
  userId: string;
};

type AttendanceData = {
  foodLogs: FoodLog[];
  isPresent: boolean;
  userId: string;
};

type ResponseType = {
  attandanceData: AttendanceData;
};

const UserProfile = () => {
  const router = useRouter();
  const [date, setDate] = React.useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [userCreatedDate, setUserCreatedDate] = useState<Date>();

  const [attendanceData, setAttendanceData] =
    useState<ResponseType["attandanceData"]>();

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
          console.log(res.data);
          setAttendanceData(res.data.attandanceData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [date]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openInput, setOpenInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
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
    setLoading(true);
    console.log(" form send");

    console.log(form);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    // const formData = new FormData();
    // Object.keys(form).forEach((key) => {
    //   const value = form[key as keyof FormState];
    //   formData.append(key, typeof value === 'number' ? value.toString() : value);
    // });

    // console.log(formData);
    // console.log(form);

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

        <div className="bg-black h-screen md:w-4/6">
          <div className="flex justify-end p-5">
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

          <div className="bg-slate-700">
            details
            {attendanceData && attendanceData.isPresent && (
              <div className="flex justify-center p-3">
                <Badge>Present</Badge>
              </div>
            )}
            {attendanceData &&
              attendanceData.foodLogs.map((data, index) => {
                return (
                  <div key={index} className="flex justify-between p-3">
                    <div>
                      <img
                        src={data.foodId.photoUrl}
                        alt={data.foodId.foodname}
                        width={50}
                        height={50}
                      />
                    </div>
                    <div>
                      <p>{data.foodId.foodname}</p>
                      <p>{data.quantity}</p>
                    </div>
                    <div>
                      <p>{data.time}</p>
                      <p>{data.timePeriod}</p>
                    </div>
                    <div>
                      <p>{data.status ? "Taken" : "Not Taken"}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
