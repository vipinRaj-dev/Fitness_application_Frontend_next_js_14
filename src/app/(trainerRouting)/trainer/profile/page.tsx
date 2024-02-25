"use client";
import axiosInstance from "@/axios/creatingInstance";
import Dnaspinner from "@/components/loadingui/Dnaspinner";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
type FormState = {
  // _id: string;
  // name: string;
  // email: string;
  // mobileNumber: number;
  // weight: number;
  // height: number;
  // profilePicture: File | string;

  description: string;
  email: string;
  experience: number;
  mobileNumber: number;
  name: string;
  price: number;
  profilePicture: string;
  specializedIn: string;
  _id: string;
};

const TrainerProfile = () => {
  const [form, setForm] = useState<FormState>({
    _id: "",
    name: "",
    email: "",
    mobileNumber: 0,
    profilePicture: "",
    specializedIn: "",
    price: 0,
    description: "",
    experience: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("trainer/profile");
        //console.log('form the profile page')
        //console.log(res.data.trainer);

        setForm((prevState) => ({
          ...prevState,
          ...res.data.trainer,
        }));
      } catch (error) {
        //console.log(error);
      }
    };
    fetchUser();
  }, []);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "image") {
      setForm((prevState) => ({
        ...prevState,
        [name]: e.target.files ? e.target.files[0] : prevState.profilePicture,
      }));
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    //console.log(" form send");

    //console.log(form);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    // const formData = new FormData();
    // Object.keys(form).forEach((key) => {
    //   const value = form[key as keyof FormState];
    //   formData.append(key, typeof value === 'number' ? value.toString() : value);
    // });

    //console.log(formData);

    await axiosInstance
      .put("/trainer/profileUpdate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        //console.log(res.data);
        setLoading(false);
        if (res.status === 200) {
          console.log(res.data);
          setForm((prevState) => ({
            ...prevState,
            profilePicture: res.data.data.url,
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
        //console.log(err.response.data);
        swal({
          title: "warning!",
          text: err.response.data.msg,
          icon: "warning",
        });
      });
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
          {form.profilePicture && (
            <img
              className="rounded-3xl border-2 border-slate-500"
              src={
                typeof form.profilePicture === "string"
                  ? form.profilePicture
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
        <h2 className="text-center text-xl font-extrabold">Trainer Profile</h2>
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
          Experience
          <input
            value={form.experience}
            name="experience"
            type="number"
            onChange={handleInputChange}
            placeholder="experience"
            className="rounded px-3 py-2 w-full  text-black"
          />
        </label>
        <label>
          SpecializedIn
          <input
            value={form.specializedIn}
            name="specializedIn"
            type="string"
            onChange={handleInputChange}
            placeholder="specializedIn"
            className="rounded px-3 py-2 w-full  text-black"
          />
        </label>
        <label>
          Price
          <input
            value={form.price}
            name="price"
            type="number"
            onChange={handleInputChange}
            placeholder="price"
            className="rounded px-3 py-2 w-full  text-black"
          />
        </label>

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

export default TrainerProfile;
