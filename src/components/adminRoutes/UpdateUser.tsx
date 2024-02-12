"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  planSelected: string;
}

const UpdateUser = ({ userId }: { userId: string }) => {
  const [userDetails, setUserDetails] = useState({} as User);

  const router = useRouter();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/admin/user/${userId}`);
        setUserDetails(response.data.user);
      } catch (error) {
        console.log("error fetching user details", error);
      }
    };
    getUserDetails();
  }, [userId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axiosInstance
      .put(`/admin/user/${userId}`, userDetails)
      .then((res) => {
        console.log(res);
        if (res.data) {
          swal({
            title: "success!",
            text: "User updated successfully!",
            icon: "success",
            className: "bg-green-100",
          }).then(() => {
            router.back();
          });
        } else {
          swal({
            title: "warning!",
            text: "User not updated!",
            icon: "warning",
            className: "bg-yellow-100",
          }).then(() => {
            router.back();
          });
        }
      })
      .catch((err) => {
       swal({
            title: "error!",
            text: err.response.data.message,
            icon: "error",
            className: "bg-red-100",
          }).then(() => {
            router.back();
          });
      });
  };

  return (
    <div>
      UpdateUser component
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          value={userDetails.name}
          type="text"
          id="username"
          name="name"
          onChange={handleChange}
        />
        <label htmlFor="email">Email</label>
        <input
          value={userDetails.email}
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
        />
        <label htmlFor="planSelected">Plan Selected</label>
        <input
          value={userDetails.planSelected}
          type="text"
          id="planSelected"
          name="planSelected"
          onChange={handleChange}
        />
        <Button type="submit">Update User</Button>
      </form>
    </div>
  );
};

export default UpdateUser;
