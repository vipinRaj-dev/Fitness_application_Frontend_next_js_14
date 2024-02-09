"use client";

import Link from "next/link";
import { useState } from "react";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(email);
    // Here you would typically send a request to your backend to initiate the password reset process
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
        <Link href="/otp">
          <button type="submit">Verify</button>
        </Link>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
