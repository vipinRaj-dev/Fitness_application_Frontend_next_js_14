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
import Spinner from "../loadingui/Spinner";
import { useToast } from "@/components/ui/use-toast";
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
  const [loading, setLoading] = useState(false);
  const myCookie = Cookies.get("jwttoken");

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (myCookie) {
      router.push("/");
    }
    // setLoading(false)
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    axios
      .post(`${baseUrl}/auth/login`, data, { withCredentials: true })
      .then((res) => {
        if (res.status === HttpStatusCode.OK) {
          Cookies.set("jwttoken", res.data.token);
          router.replace("/");
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log("sign in error");

        setLoading(false);
        if (error.response) {
          setError(error.response.data.msg);
        }
      });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          description: `${text} copied to clipboard!`,
        });
      })
      .catch(() => {
        toast({
          description: "Failed to copy",
        });
      });
  };
  return (
    <div className="w-full ">
      <div className="bg-gray-800 p-5 rounded-3xl space-y-3">
        <div>
          <p
            onClick={() => copyToClipboard("testuser@gmail.com")}
            className="italic cursor-grab"
          >
            Copy User Email : testuser@gmail.com
          </p>
          <p
            onClick={() => copyToClipboard("test@9876")}
            className="italic cursor-grab"
          >
            Copy User Password : test@9876
          </p>
        </div>
        <div>
          <p
            onClick={() => copyToClipboard("Trainer@gmail.com")}
            className="italic cursor-grab"
          >
            Copy Trainer Email : Trainer@gmail.com
          </p>
          <p
            onClick={() => copyToClipboard("trainer@9876")}
            className="italic cursor-grab"
          >
            Copy Trainer Password : trainer@9876
          </p>
        </div>
      </div>
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
