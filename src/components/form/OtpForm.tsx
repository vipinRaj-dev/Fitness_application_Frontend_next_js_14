"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import { UserDataType } from "@/components/form/SignUpForm";
import { Button } from "../ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { HttpStatusCode } from "@/types/HttpStatusCode";

const OtpForm = ({ data }: { data?: UserDataType }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError("Invalid otp");
      return;
    }
    axios
      .post(`${baseUrl}/auth/registerUser`, { otp, data })
      .then((res) => {
        if (res.status === HttpStatusCode.CREATED) {
          // console.log("User created");
          router.replace("/sign-in");
        } else {
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
          timer: 1500,
          buttons: {},
        });
      });
  };

  const handleResendOtp = () => {
    setTimer(60);
    axios
      .post(`${baseUrl}/auth/sendOtp`, data)
      .then((res) => {
        if (res.status === HttpStatusCode.OK) {
          console.log("Otp sent");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (timer > 0) {
      window.onbeforeunload = () => true;
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(countdown);
    } else {
      window.onbeforeunload = null;
    }
  }, [timer]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-6 text-3xl font-bold text-gray-700">Enter OTP</h1>
      <form
        onSubmit={handleSubmit}
        className="w-1/3 bg-white p-6 rounded-xl shadow-md"
      >
        <h1 className="text-red-600 text-center">{error && error}</h1>
        <label className="block mb-4">
          <span className="text-gray-700">OTP:</span>
          {/* <input
            type="number"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setError("");
            }}
            className="mt-1 block w-full rounded-md text-black shadow-sm border-none outline-none text-center"
          /> */}
          <div className="flex justify-center text-black">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </label>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-500"
        >
          Submit
        </button>
        <p className="text-black text-center">
          {timer === 0 ? (
            <Button
              variant={"ghost"}
              size={"sm"}
              className="bg-white mt-3 hover:bg-slate-200 hover:text-black"
              onClick={handleResendOtp}
            >
              Resend otp
            </Button>
          ) : (
            `${timer} seconds remaining`
          )}
        </p>
      </form>
    </div>
  );
};

export default OtpForm;
