"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { baseUrl } from "@/Details/PortDetails";
import { useState } from "react";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
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

  const router = useRouter();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    axios
      .post(`${baseUrl}/auth/login`, data, { withCredentials: true })
      .then(function (response) {
        console.log(response);
        router.push("/");
      })
      .catch(function (error) {
        if (error.response) {
          setError(error.response.data.msg);
        }
      });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full mt-7" type="submit">
          SignIn
        </Button>
        <p className="text-center mt-4">
          Don't have an account?
          <Link className="hover:underline" href="/sign-up">
            Sign Up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignInForm;
