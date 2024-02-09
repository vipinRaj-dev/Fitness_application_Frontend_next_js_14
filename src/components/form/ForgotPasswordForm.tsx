"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../loadingui/Spinner";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Spinner />;
  }

  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Here you would typically send a request to your backend to initiate the password reset process
    try {
      axios
        .post(`${baseUrl}/auth/forgot-password`, {
          email: email,
          password: password,
        })
        .then((res) => {
          console.log(res);
          setLoading(false);

          return router.replace("/otp-verification-forgotpassword");
        })
        .catch((err) => {
          setLoading(false);

          alert("user not found");
          console.error(err);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("forgot password some problem");
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          New password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
