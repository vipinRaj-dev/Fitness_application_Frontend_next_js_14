"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../loadingui/Spinner";
import swal from "sweetalert";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (loading) {
    return <Spinner />;
  }


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
   
    try {
      axios
        .post(`${baseUrl}/auth/forgot-password`, {
          email: email,
          password: password,
        })
        .then((res) => {
          // console.log(res);
          setLoading(false);

          return router.replace("/otp-verification-forgotpassword");
        })
        .catch((err) => {
          setLoading(false);
          swal({
            title: "Error",
            text: "User not found",
            icon: "error",
          });
          console.error(err);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
      swal({
        title: "Error",
        text: "password reset failed",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-6 text-3xl font-bold text-gray-400">Forgot Password</h1>
      <form
        onSubmit={handleSubmit}
        className="w-1/3 bg-slate-300 p-6 rounded-xl shadow-md"
      >
        <label className="block mb-4">
          <span className="text-gray-700">Email:</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block p-2 w-full rounded-md text-black shadow-sm border-none outline-none"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">New password:</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 block w-full rounded-md text-black shadow-sm border-none outline-none"
          />
        </label>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-500"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
