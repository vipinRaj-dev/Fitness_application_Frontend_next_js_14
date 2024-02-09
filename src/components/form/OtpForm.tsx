"use client";

import React, { useState } from "react";
import { userStore } from "@/store/user";

const OtpForm = () => {
  const [otp, setOtp] = useState("");

  const { user } = userStore();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(otp);
    // Here you would typically send a request to your backend to verify the OTP
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"> 
    {user&&<h1 className="mb-6 text-3xl font-bold text-gray-700"> {user.name}</h1>}
    {user&&<h1 className="mb-6 text-3xl font-bold text-gray-700"> {user.email}</h1>}
    {user&&<h1 className="mb-6 text-3xl font-bold text-gray-700"> {user.password}</h1>}
      <h1 className="mb-6 text-3xl font-bold text-gray-700">Enter OTP</h1>
      <form onSubmit={handleSubmit} className="w-64">
        <label className="block mb-4">
          <span className="text-gray-700">OTP:</span>
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
