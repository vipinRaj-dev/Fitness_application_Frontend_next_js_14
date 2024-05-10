"use client";
import axiosInstance from "@/axios/creatingInstance";
import { FormState } from "@/types/UserTypes";
import { useState } from "react";
import swal from "sweetalert";
import { Badge } from "../ui/badge";
import Dnaspinner from "../loadingui/Dnaspinner";
import { AxiosError } from "@/types/ErrorType";
import { HttpStatusCode } from "@/types/HttpStatusCode";

type error = {
  mobileNumber?: string;
  height?: string;
  weight?: string;
};

const UserProfileEdit = ({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) => {
  const [errors, setErrors] = useState<error>({});
  const [openInput, setOpenInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
    if (type === "checkbox") {
      setForm((prevState: FormState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (name === "image") {
      setForm((prevState: FormState) => ({
        ...prevState,
        [name]: e.target.files ? e.target.files[0] : prevState.profileImage,
      }));
    } else {
      setForm((prevState: FormState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true);

    // console.log(form);
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
      // console.log("form send");
      // console.log('form data' , form)
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach((key: string) => {
        const value = form[key as keyof typeof form];
        if (typeof value === 'boolean' || typeof value === 'number') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string | Blob);
        }
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
          if (res.status === HttpStatusCode.OK) {
            setForm((prevState: FormState) => ({
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
        .catch((err) => {
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

  if (loading) {
    return <Dnaspinner />;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center min-h-96 py-2"
      >
        <div className="flex flex-col bg-slate-900 p-5 rounded-xl shadow-2xl w-full md:w-full border-2 border-slate-500  space-y-6">
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
    </>
  );
};

export default UserProfileEdit;
