"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";

type User = {
  admissionNumber: number;
  dueDate: string;
  name: string;
  profileImage: string;
  trainerPaymentDueDate: string;
  userBlocked: boolean;
  _id: string;
};

const page = () => {
  const [allUsers, setAllUsers] = useState([]); // all users data
  useEffect(() => {
    const getallusers = async () => {
      try {
        await axiosInstance
          .get("/trainer/allClients")
          .then((res) => {
            console.log(res.data);
            setAllUsers(res.data);
          })
          .catch((err) => {
            console.log(err.response.data);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getallusers();

    console.log("all users page");
  }, []);

  return (
    <div>
      <div>
        <h1>All Users</h1>
      </div>

      <div>search bar</div>

      <div className=" p-2 md:p-10">
        <table className="table-fixed w-full text-left text-sm md:text-base">
          <thead className=" text-white">
            <tr>
              <th className="px-1 py-1">Sl No</th>
              <th className="px-1 py-1">Profile</th>
              <th className="px-1 py-1">Name</th>
              <th className="px-1 py-1">Due </th>
              <th className="px-1 py-1">Blocked</th>
              <th className="px-1 py-1">View</th>
            </tr>
          </thead>
          <tbody className="">
            {allUsers.map((user: User, index: number) => {
              return (
                <tr
                  key={user._id}
                  className="odd:bg-gray-600 even:bg-gray-950 rounded-lg"
                >
                  <td className="px-1 py-1 text-center md:text-left">
                    {index + 1}
                  </td>
                  <td className="px-1 py-1">
                    <img
                      src={user.profileImage}
                      alt="profile"
                      className="w-8 h-8 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-3 overflow-auto">{user.name}</td>
                  <td className="px-4 py-3 overflow-auto">
                    {new Date(user.trainerPaymentDueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 overflow-auto">
                    {user.userBlocked ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 overflow-auto">View</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <div>
        <div>
          <div>profile picture</div>
          <div>
            <div>Name</div>
            <div>Plan</div>
          </div>
          <div>adminsion number</div>
        </div>
        <div>profile view</div>
      </div> */}
    </div>
  );
};

export default page;
