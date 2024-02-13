"use client";

import axiosInstance from "@/axios/creatingInstance";
import { Button } from "../ui/button";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
const CreateUser = () => {
  const router = useRouter();
  const handleCreateUserSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const userData = {
      name :username,
      email,
      password,
    };
    await axiosInstance
      .post("/admin/createUser", userData)
      .then((res) => {
        console.log(res);
        if(res.data){
          alert(res.data.message)
          swal({
            title: "User Created",
            text: res.data.message,
            icon: "success",
          }).then(() => {
            router.back();
          })
        }else{
         swal({
            title: "User Not Created",
            text: res.data.message,
            icon: "error",
          })
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  return (
    <div className="bg-white p-6 rounded shadow-md mx-auto mt-10">
    <form onSubmit={handleCreateUserSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium  text-gray-700">Username</label>
        <input type="text" id="username" name="username" className=" text-slate-600 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" name="email" className="text-slate-600 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" id="password" name="password" className="text-slate-600 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>
      <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Create User</Button>
    </form>
  </div>
  );
};

export default CreateUser;