"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { baseUrl } from "@/Utils/PortDetails";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { HttpStatusCode } from "@/types/HttpStatusCode";
// import Spinner from "../loadingui/Spinner";
const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(4, "Password must have than 8 characters"),
});

const SignInForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);
  const myCookie = Cookies.get("jwttoken");

  const router = useRouter();

  useEffect(() => {
    if (myCookie) {
      router.push("/");
    }
    // setLoading(false)
  }, []);

  // if (loading) {
  //   return <Spinner />;
  // }

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    axios
      .post(`${baseUrl}/auth/login`, data, { withCredentials: true })
      .then((res) => {
        if (res.status === HttpStatusCode.OK) {
          router.replace("/");
        }
      })
      .catch(function (error) {
        if (error.response) {
          setError(error.response.data.msg);
        }
      });
  };
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-end items-center">
                  <Link
                    className="hover:underline text-center"
                    href="/forgotpassword"
                  >
                    ForgotPassword
                  </Link>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-2 " type="submit">
            SignIn
          </Button>
          <p className="text-center mt-4 block">
            Don&apos;t have an account
            <Link className="hover:underline mx-2" href="/sign-up">
              Sign Up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
