"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { baseUrl } from "@/Utils/PortDetails";
import { Button } from "../ui/button";
import Link from "next/link";
import axiosInstance from "@/axios/creatingInstance";
import swal from "sweetalert";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  userBlocked: boolean;
}

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    let token = Cookies.get("jwttoken");
    const fetchData = async () => {
      // console.log("fetchData");

      await axios
        .get(`${baseUrl}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data.users);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData();
  }, []);

  const blockuser = async (userId: string) => {
    if (userId) {
      await axiosInstance
        .put(`/admin/user/block/${userId}`)
        .then((res) => {
          console.log(res);
          if (res.data) {
            setUsers(
              users.map((user) =>
                user._id === userId
                  ? { ...user, userBlocked: !user.userBlocked }
                  : user
              )
            );
            swal({
              title: "User Updated",
              text: res.data.message,
              icon: "success",
            });
          } else {
            swal({  
              title: "User Not Updated",
              text: res.data.message,
              icon: "error",
            });
          }
        })
        .catch((err) => {
          swal({
            title: "Error",
            text: err.response.data.message,
            icon: "error",
          });
        });
    }
  };

  return (
    <div className="w-full  p-6">
  <h1 className="text-4xl mb-4 text-white">Users</h1>
  <div className="overflow-x-auto max-w-screen">
    <table className="w-full text-md  shadow-md rounded mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 px-5">Sl Number</th>
              <th className="text-left p-3 px-5">Name</th>
              <th className="text-left p-3 px-5">Email</th>
              <th className="text-left p-3 px-5">Role</th>
              <th className="text-left p-3 px-5">Update</th>
              <th className="text-left p-3 px-5">Block</th>
              <th className="text-left p-3 px-5">View</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
             <tr className="border-b hover:bg-slate-900 " key={user._id}>
             <td className="p-3 px-5 overflow-auto">{index + 1}</td>
             <td className="p-3 px-5 overflow-auto">{user.name}</td>
             <td className="p-3 px-5 overflow-auto">{user.email}</td>
             <td className="p-3 px-5 overflow-auto">{user.role}</td>
                <td className="p-3 px-5">
                  <Link href={`/admin/users/update/${user._id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Update
                    </Button>
                  </Link>
                </td>
                <td className="p-3 px-5">
                  <Button
                    onClick={() => {
                      blockuser(user._id);
                    }}
                    className={`font-bold py-2 px-4 rounded ${
                      user.userBlocked
                        ? "bg-green-500 hover:bg-green-700"
                        : "bg-red-500 hover:bg-red-700"
                    }`}
                  >
                    {user.userBlocked ? "Unblock" : "Block"}
                  </Button>
                </td>
                <td className="p-3 px-5">
                  <Link href={`/admin/users/view/${user._id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
