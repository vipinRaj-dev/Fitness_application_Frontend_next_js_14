"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../loadingui/Spinner";
import swal from "sweetalert";

const OtpFormForgotPassword = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  if (loading) {
    return <Spinner />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send a request to your backend to verify the OTP
    axios
      .post(`${baseUrl}/auth/verifyOtp`, { otp })
      .then((res) => {
        setLoading(true);
        // console.log(res);
        if (res.status === 200) {
          setLoading(false);
          console.log("User created");
          swal({
            title: "Success",
            text: "password reset successfully",
            icon: "success",
          });
          router.replace("/sign-in");
        } else if (res.status === 404) {
          swal({
            title: "Error",
            text: "User not found",
            icon: "error",
          });
        } else {
          setLoading(false);
          console.log("User not created from the otp page");
          throw new Error("User not created");
        }
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Error",
          text: "Invalid otp or expired otp",
          icon: "error",
        });
        console.error("here is the error");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-gray-700">Enter OTP</h1>
      <h1 className="mb-6 text-xl  text-gray-700">Otp has send to the email</h1>
      <form onSubmit={handleSubmit} className="w-64">
        <label className="block mb-4">
          <span className="text-gray-700">OTP:</span>
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="mt-1 p-2 block w-full rounded-md  text-black text-center outline-none"
          />
        </label>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-indigo-500 rounded-2xl hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default OtpFormForgotPassword;
