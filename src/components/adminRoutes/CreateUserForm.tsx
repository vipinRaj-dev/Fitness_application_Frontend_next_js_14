"use client";

import axiosInstance from "@/axios/creatingInstance";
import { Button } from "../ui/button";

const CreateUser = () => {
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
        }else{
          alert("User not created")
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  return (
    <div>
      CreateUser components
      <form onSubmit={handleCreateUserSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <Button type="submit">Create User</Button>
      </form>
    </div>
  );
};

export default CreateUser;
