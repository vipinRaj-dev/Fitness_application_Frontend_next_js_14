"use client";
import axiosInstance from "@/axios/creatingInstance";
import Dnaspinner from "@/components/loadingui/Dnaspinner";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { AxiosError } from "@/types/ErrorType";
import {TrainerProfileFormState} from "@/types/TrainerTypes";
import { HttpStatusCode } from "@/types/HttpStatusCode";


const createSchema = (minLength: number, errorMessage: string) => {
  return z
    .string()
    .min(minLength, errorMessage)

    .refine(
      (value) => value.trim() === value,
      "No leading or trailing spaces allowed"
    )
    .refine(
      (value) => value === value.replace(/\s+/g, " "),
      "No multiple spaces allowed"
    )
    .refine(
      (value) => /^[a-zA-Z, .-]*$/.test(value),
      "Only Characters are allowed"
    )
    .refine(
      (value) => value === value.replace(/\s*,\s*/g, ","),
      "No multiple spaces or commas allowed"
    );
};

const descriptionSchema = createSchema(1, "Description is required");
const specializedInSchema = createSchema(1, "SpecializedIn is required");

const schema = z.object({
  image: z.any().refine((file) => {
    if (!file) {
      return true;
    }
    // console.log(file);
    return file.type === "image/avif" || file.type === "image/png"|| file.type === "image/jpeg" ||file.type === "image/webp";
  }, "Invalid image file"),
  name: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must not exceed 20 characters")
    .refine(
      (value) => value === value.replace(/\s+/g, " "),
      "No multiple spaces allowed"
    ),
  email: z.string().email("Invalid email address"),
  description: descriptionSchema,
  specializedIn: specializedInSchema,
  price: z
    .number()
    .int()
    .min(1, "Price is required")
    .or(z.string().min(1, "Price is required")),
  mobileNumber: z
    .string()
    .min(10, "Mobile Number should be 10 digits")
    .max(10, "Mobile Number should be 10 digits")
    .or(
      z
        .number()
        .int()
        .min(1000000000, "Mobile Number should be 10 digits")
        .max(9999999999, "Mobile Number should be 10 digits")
    ),
});

const TrainerProfile = () => {
  const router = useRouter();
  const [form, setForm] = useState<TrainerProfileFormState>({
    _id: "",
    name: "",
    email: "",
    mobileNumber: "",
    profilePicture: "",
    specializedIn: "",
    price: "",
    description: "",
    experience: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("trainer/profile");
        // console.log('form the profile page')
        // console.log(res.data.trainer);

        setForm((prevState) => ({
          ...prevState,
          ...res.data.trainer,
        }));
      } catch (error) {
        console.log(error);
        if ((error as AxiosError).response?.status === 404) {
          Cookies.remove("jwttoken");
          router.replace("/sign-in");
        }
      }
    };
    fetchUser();
  }, []);

  const [errors, setErrors] = useState<TrainerProfileFormState>({
    name: "",
    email: "",
    mobileNumber: "",
    profilePicture: "",
    specializedIn: "",
    price: "",
    description: "",
    experience: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "experience" && parseInt(value) < 0) {
      setErrors((prevError) => {
        return {
          ...prevError,
          experience: "Experience cannot be negative",
        };
      });
    } else if (name === "price" && parseInt(value) < 0) {
      setErrors((prevError) => {
        return {
          ...prevError,
          price: "Price cannot be negative",
        };
      });
    }
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

    const result = schema.safeParse(form);
    // console.log("form", form);
    if (!result.success) {
      const errorMap = result.error.formErrors.fieldErrors;
      // console.log("errorMap", errorMap);
      setErrors((prevError) => {
        return {
          ...prevError,
          name: errorMap.name ? errorMap.name[0] : "",
          email: errorMap.email ? errorMap.email[0] : "",
          mobileNumber: errorMap.mobileNumber ? errorMap.mobileNumber[0] : "",
          specializedIn: errorMap.specializedIn
            ? errorMap.specializedIn[0]
            : "",
          price: errorMap.price ? errorMap.price[0] : "",
          description: errorMap.description ? errorMap.description[0] : "",
          profilePicture: errorMap.image ? errorMap.image[0] : "",
        };
      });
    } else {
      setLoading(true);
      setErrors({
        name: "",
        email: "",
        mobileNumber: "",
        profilePicture: "",
        specializedIn: "",
        price: "",
        description: "",
        experience: "",
      });

      // console.log(" form send");

      // console.log(form);

      const formData = new FormData();
      Object.keys(form).forEach((key: string) => {
        const value = form[key as keyof typeof form];
        if (typeof value === 'boolean' || typeof value === 'number') {
          formData.append(key, value.toString());
        }else {
          formData.append(key, value as string | Blob);
        }
      });
      await axiosInstance
        .put("/trainer/profileUpdate", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // console.log(res.data);
          setLoading(false);
          if (res.status === HttpStatusCode.OK) {
            
            // console.log(res.data);
            if (res.data?.data?.url) {
              setForm((prevState) => ({
                ...prevState,
                profilePicture: res.data.data.url,
              }));
            }
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
        .catch((err) => {
          setLoading(false);
          // console.log(err);
          swal({
            title: "warning!",
            text: "Your profile has not been updated",
            icon: "warning",
          });
        });
    }
  };

  if (loading) {
    return <Dnaspinner />;
  }
  return (
    <form
      noValidate
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

        <label>
          Image
          <input
            name="image"
            type="file"
            onChange={handleInputChange}
            className="rounded px-3 py-2 w-full"
          />
          {errors.profilePicture && (
            <p className="text-red-600 mt-2">{errors.profilePicture}</p>
          )}
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
          {errors.name && <p className="text-red-600 mt-2">{errors.name}</p>}
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
          {errors.email && <p className="text-red-600 mt-2">{errors.email}</p>}
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
            <p className="text-red-600 mt-2">{errors.mobileNumber}</p>
          )}
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
          {errors.experience && (
            <p className="text-red-600 mt-2">{errors.experience}</p>
          )}
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
          {errors.specializedIn && (
            <p className="text-red-600 mt-2">{errors.specializedIn}</p>
          )}
        </label>
        <label>
          Description
          <input
            value={form.description}
            name="description"
            type="string"
            onChange={handleInputChange}
            placeholder="description"
            className="rounded px-3 py-2 w-full  text-black"
          />
          {errors.description && (
            <p className="text-red-600 mt-2">{errors.description}</p>
          )}
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
          {errors.price && <p className="text-red-600 mt-2">{errors.price}</p>}
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
