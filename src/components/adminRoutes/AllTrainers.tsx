"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { baseUrl } from "@/Utils/PortDetails";
import { Button } from "../ui/button";
import Link from "next/link";
import axiosInstance from "@/axios/creatingInstance";
import swal from "sweetalert";
 
interface Trainer {
  _id: string;
  email: string;
  name: string;
  role: string;
  isBlocked: boolean;
}

const AllTrainer = () => {
  const [trainer, setTrainer] = useState<Trainer[]>([]);


  useEffect(() => {
    let token = Cookies.get("jwttoken");
    const fetchData = async () => {
      // console.log("fetchData");

      await axios
        .get(`${baseUrl}/admin/trainers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTrainer(response.data.trainer);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData();
  }, []);

  const blocktrainer = async (trainerId: string) => {
    if (trainerId) {
      await axiosInstance
        .put(`/admin/trainer/block/${trainerId}`)
        .then((res) => {
          console.log(res);
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTrainer;
