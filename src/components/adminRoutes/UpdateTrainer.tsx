"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

interface trainer {
  _id: string;
  email: string;
  name: string;
  role: string;
}

const UpdateTrainer = ({ trainerId }: { trainerId: string }) => {
  const [trainerDetails, setTrainerDetails] = useState<trainer>({
    _id: "",
    email: "",
    name: "",
    role: "",
  });

  const router = useRouter();

  useEffect(() => {
    const gettrainerDetails = async () => {
      try {
        const response = await axiosInstance.get(`/admin/trainer/${trainerId}`);
        setTrainerDetails(response.data.trainer);
      } catch (error) {
        console.log("error fetching user details", error);
      }
    };
    gettrainerDetails();
  }, [trainerId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrainerDetails({
      ...trainerDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axiosInstance
      .put(`/admin/trainer/${trainerId}`, trainerDetails)
      .then((res) => {
        // console.log(res);
        if (res.data) {
          swal({
            title: "success!",
            text: "Trainer updated successfully!",
            icon: "success",
            className: "bg-green-100",
          }).then(() => {
            router.back();
          });
        } else {
          swal({
            title: "warning!",
            text: "Trainer not updated!",
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
    <div className="bg-white  p-6 rounded-2xl shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-2xl text-black mb-4">Update Trainer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            value={trainerDetails.name}
            type="text"
            id="username"
            name="name"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            value={trainerDetails.email}
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div></div>
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Update Trainer
        </Button>
      </form>
    </div>
  );
};

export default UpdateTrainer;
