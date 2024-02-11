"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { baseUrl } from "@/Utils/PortDetails";
import { Button } from "../ui/button";
import Link from "next/link";
import axiosInstance from "@/axios/creatingInstance";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [block, setBlock] = useState(false);
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
          // console.log(response.data.users);
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
            alert(res.data.message);
            setBlock(!block);
          } else {
            alert("User not updated");
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
  };

  return (
    <div>
      AllUsers components
      <h1>Users</h1>
      {users.map((user, index) => {
        return (
          <div key={user._id}>
            <h3>{index + 1}</h3>
            <h3>{user.name}</h3>
            <h3>{user.email}</h3>
            <h3>{user.role}</h3>
            <Link href={`/admin/users/update/${user._id}`}>
              <Button>Update</Button>
            </Link>
            <Button
              onClick={() => {
                blockuser(user._id);
              }}
            >
              {block ? "Unblock" : "Block"}
            </Button>
            <Link href={`/admin/users/view/${user._id}`}>
              <Button>View</Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default AllUsers;
