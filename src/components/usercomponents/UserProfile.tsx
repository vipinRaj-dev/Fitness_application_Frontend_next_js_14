"use client";
import axiosInstance from "@/axios/creatingInstance";
import Dnaspinner from "@/components/loadingui/Dnaspinner";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import Link from "next/link";
import { Badge } from "../ui/badge";
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
          .then((res) =>
            setForm((prevState) => ({
              ...prevState,
              ...res.data.user,
              ...res.data.user.healthIssues,
            }))
          // console.log(res.data.user)

          )
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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openInput, setOpenInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm(prevState => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (name === "image") {
      setForm((prevState) => ({
        ...prevState,
        [name]: e.target.files ? e.target.files[0] : prevState.profileImage,
      }));
    } else {
      setForm(prevState => ({
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
  if (loading) {
    return <Dnaspinner />;
  }
  return (
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
        <h2 className="text-center text-xl font-extrabold">User Profile</h2>
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
  );
};

export default UserProfile;
