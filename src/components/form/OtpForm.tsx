"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

const OtpForm = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Here you would typically send a request to your backend to verify the OTP
    axios
      .post(`${baseUrl}/auth/registerUser`, { otp })
      .then((res) => {
        if (res.status === 201) {
          console.log("User created");
          router.replace("/sign-in");
        } else {
          console.log("User not created from the otp page");
          throw new Error("User not created");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("otp is not valid or time expired");
      });
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else {
      swal({
        title: "warning!",
        text: "Otp time expired",
        icon: "warning",
      }).then(() => { 
        router.replace("/sign-up");
      })
    }
  }, [timer]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-6 text-3xl font-bold text-gray-700">Enter OTP</h1>
      <form
        onSubmit={handleSubmit}
        className="w-1/3 bg-white p-6 rounded-xl shadow-md"
      >
        <label className="block mb-4">
          <span className="text-gray-700">OTP:</span>
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="mt-1 block w-full rounded-md text-black shadow-sm border-none outline-none text-center"
          />
        </label>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-500"
        >
          Submit
        </button>
        <p className="text-black text-center">{timer === 0 ? "Resend OTP" : `${timer} seconds remaining`}</p>
      </form>
    </div>
  );
};

export default OtpForm;
