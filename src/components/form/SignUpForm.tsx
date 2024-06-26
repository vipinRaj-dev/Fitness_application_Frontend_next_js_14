"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import OtpForm from "./OtpForm";
import Spinner from "../loadingui/Spinner";

export type UserDataType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const FormSchema = z
  .object({
    name: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .refine(password => /[a-z]/.test(password), {
        message: "Password must include at least one lowercase letter",
      })
      .refine(password => /[A-Z]/.test(password), {
        message: "Password must include at least one uppercase letter",
      })
      .refine(password => /\d/.test(password), {
        message: "Password must include at least one number",
      })
      .refine(password => /[@$!%*?&]/.test(password), {
        message: "Password must include at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must have at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
const SignUpForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState(false);
  const [userData, setUserData] = useState<UserDataType | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const myCookie = Cookies.get("jwttoken");

  useEffect(() => {
    if (myCookie) {
      router.push("/");
    }
    setLoading(false);
  }, [myCookie]);

  if (loading) {
    return <Spinner />;
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // console.log(data);

    setLoading(true);
    axios
      .post(`${baseUrl}/auth/sendOtp`, data)
      .then((response) => {
        if (response.status === 200) {
          // console.log("User created");
          setError("");
          setUserData(data);
          setOtp(true);
          // router.replace("/otp-verification");
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setLoading(false);
          setError("Email already exists");
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div>
      <div
        className={`flex justify-center items-center min-h-screen z-10 ${
          otp && "hidden"
        }`}
      >
        <div className="border-2 border-cyan-100 p-2 flex rounded-lg w-7/12">
          <div className="rounded-lg overflow-hidden hidden lg:block shadow-lg">
            <Image
              alt="dummyimage"
              src={"/images/signuppageimg.png"}
              width={400}
              height={500}
              className="object-cover"
            ></Image>
          </div>
          <div className="flex justify-center items-center m-4 w-full lg:w-1/2 lg:ml-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                {error && (
                  <p className="text-red-500 text-center text-2xl">{error}</p>
                )}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="block text-slate-300 text-sm font-bold mb-2">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Jacob"
                          {...field}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="block text-slate-300 text-sm font-bold mb-2">
                        E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@gmail.com"
                          {...field}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="block text-slate-300 text-sm font-bold mb-2">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          {...field}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="block text-slate-300 text-sm font-bold mb-2">
                        Confirm password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter Confirm password"
                          {...field}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="bg-slate-200 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-7"
                  type="submit"
                >
                  Sign Up
                </Button>
                <p className="text-center mt-4">
                  Don&apos;t have an account?
                  <Link
                    className="hover:underline ms-2 text-blue-500"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
      {otp && userData && <OtpForm data={userData} />}
    </div>
  );
};

export default SignUpForm;
