"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { baseUrl } from "@/Utils/PortDetails";
import { Button } from "../ui/button";
import Link from "next/link";
import axiosInstance from "@/axios/creatingInstance";
import swal from "sweetalert";


import { Trainer } from "@/types/TrainerTypes";
// interface Trainer {
//   _id: string;
//   email: string;
//   name: string;
//   role: string;
//   isBlocked: boolean;
// }

const AllTrainer = () => {
  const [trainer, setTrainer] = useState<Trainer[]>([]);

  const [page, setPage] = useState(1);  
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get("/admin/trainers", {
          params: {
            page,
            search,
            limit,
          },
        })
        .then((response) => {
          // console.log(response.data);
          setTrainer(response.data.trainer);
          setLimit(response.data.limit);
          if (search !== "") {
            setPage(1);
          }
          setTotalPages(
            Math.ceil(response.data.totalTrainers / response.data.limit)
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData();
  }, [page, search]);

  const blocktrainer = async (trainerId: string) => {
    if (trainerId) {
      await axiosInstance
        .put(`/admin/trainer/block/${trainerId}`)
        .then((res) => {
          // console.log(res);
          if (res.data) {
            setTrainer(
              trainer.map((trainer) =>
                trainer._id === trainerId
                  ? { ...trainer, isBlocked: !trainer.isBlocked }
                  : trainer
              )
            );
            swal({
              title: "trainer Updated",
              text: res.data.message,
              icon: "success",
            });
          } else {
            swal({
              title: "trainer Not Updated",
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
      <h1 className=" text-center p-5">All Trainers</h1>
      <div id="search-bar" className="max-w-full rounded-md shadow-lg z-10 ">
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
      </div>
      <div className="flex justify-end">
        <Button variant={"outline"} size={"sm"} className="mt-2">
          <Link
            className="text-blue-700 text-center"
            href="/admin/trainers/create"
          >
            Create Trainer
          </Link>
        </Button>
      </div>
      <h1 className="text-4xl mb-4 text-white">Trainer</h1>
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
            {trainer.map((trainer, index) => (
              <tr className="border-b hover:bg-slate-900 " key={trainer._id}>
                <td className="p-3 px-5 overflow-auto">{index + 1}</td>
                <td className="p-3 px-5 overflow-auto">{trainer.name}</td>
                <td className="p-3 px-5 overflow-auto">{trainer.email}</td>
                <td className="p-3 px-5 overflow-auto">{trainer.role}</td>
                <td className="p-3 px-5">
                  <Link href={`/admin/trainers/update/${trainer._id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Update
                    </Button>
                  </Link>
                </td>
                <td className="p-3 px-5">
                  <Button
                    onClick={() => {
                      blocktrainer(trainer._id);
                    }}
                    className={`font-bold py-2 px-4 rounded ${
                      trainer.isBlocked
                        ? "bg-green-500 hover:bg-green-700"
                        : "bg-red-500 hover:bg-red-700"
                    }`}
                  >
                    {trainer.isBlocked ? "Unblock" : "Block"}
                  </Button>
                </td>
                <td className="p-3 px-5">
                  <Link href={`/admin/trainers/view/${trainer._id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}

            {trainer.length === 0 && (
              <>
                <tr>
                  <td colSpan={7} className="text-center p-3 px-5">
                    No Trainer Found
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
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
  );
};

export default AllTrainer;
