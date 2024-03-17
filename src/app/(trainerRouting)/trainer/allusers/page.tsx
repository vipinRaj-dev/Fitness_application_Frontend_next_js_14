"use client";

import axiosInstance from "@/axios/creatingInstance";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(2);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get("/trainer/allClients", {
          params: {
            page,
            search,
            limit,
          },
        })
        .then((response) => {
          // console.log(response.data);
          setAllUsers(response.data.allClients);
          setLimit(response.data.limit);
          if (search !== "") {
            setPage(1);
          }
          setTotalPages(
            Math.ceil(response.data.totalClients / response.data.limit)
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData();
  }, [page, search]);

  return (
    <div>
      <div>
        <h1>All Users</h1>
      </div>

      <form className="flex items-center justify-end p-2">
        <h1> Search</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search here"
          className=" text-black rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent mx-2"
        />
      </form>

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
                  <td className="px-4 py-3 overflow-auto">
                    <Link href={`/trainer/client/${user._id}`}>View</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end">
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 ${
                page === index + 1 ? "bg-blue-500" : ""
              }`}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
