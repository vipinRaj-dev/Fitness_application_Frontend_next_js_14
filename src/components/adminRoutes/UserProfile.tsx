"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";

const UserProfile = ({ userId }: { userId: string }) => {
  const [userData, setUserData] = useState({
    _id: "",
    email: "",
    name: "",
    role: "",
    planSelected: "",
  });
  useEffect(() => {
    // console.log("this is the user id from the parmas ", userId);
    const fetchData = async () => {
      console.log("fetchData");
      await axiosInstance
        .get(`/admin/user/${userId}`)
        .then((response) => {
          if (response.data) {
            // console.log(response.data);
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
    <div className="flex ">
      <div className="flex flex-col">
        <div className="bg-white p-6 rounded shadow-md max-w-lg my-2 ">
          <h1 className="text-2xl mb-4">User Profile</h1>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700">
              Name : <span className="font-normal">{userData.name}</span>
            </h3>
            <h3 className="text-lg font-medium text-gray-700">
              Email : <span className="font-normal">{userData.email}</span>
            </h3>
            <h3 className="text-lg font-medium text-gray-700">
              Role : <span className="font-normal">{userData.role}</span>
            </h3>
            <h3 className="text-lg font-medium text-gray-700">
              Plan Selected :
              <span className="font-normal">{userData.planSelected}</span>
            </h3>
          </div>
        </div>
        <div className=" bg-slate-300 max-w-lg h-80 ">calender</div>
      </div>
      <div className="bg-slate-300 rounded-md m-2 w-full">user Details</div>
    </div>
  );
};

export default UserProfile;
