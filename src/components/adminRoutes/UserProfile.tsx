"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  planSelected: string;
}

const UserProfile = ({ userId }: { userId: string }) => {
  const [userData, setUserData] = useState<User>({} as User);
  useEffect(() => {
    console.log("this is the user id from the parmas ", userId);
    const fetchData = async () => {
      console.log("fetchData");
      await axiosInstance
        .get(`/admin/user/${userId}`)
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            setUserData(response.data.user);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData();
  }, [userId]);

  return (
    <div>
      this is the userProfile components user id: {userId}
      <h1>User Profile</h1>
      <h3>Name : {userData.name}</h3>
      <h3>Email : {userData.email}</h3>
      <h3>Role : {userData.role}</h3>
      <h3>Plan Selected : {userData.planSelected}</h3>
      
    </div>
  );
};

export default UserProfile;
