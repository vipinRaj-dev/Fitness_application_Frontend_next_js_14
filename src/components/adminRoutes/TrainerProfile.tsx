"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";

interface Trainer {
  _id: string;
  email: string;
  name: string; 
  role: string;
}

const TrainerProfile = ({ trainerId }: { trainerId: string }) => {
  const [trainerData, setTrainerData] = useState<Trainer>({} as Trainer);
  useEffect(() => {
    // console.log("this is the Trainer id from the parmas ", trainerId);
    const fetchData = async () => {
      console.log("fetchData");
      await axiosInstance
        .get(`/admin/trainer/${trainerId}`)
        .then((response) => {
          if (response.data) {
            // console.log(response.data);
            setTrainerData(response.data.trainer);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData();
  }, [trainerId]);

  return (
    <div className="flex ">
      <div className="flex flex-col">
        <div className="bg-white p-6 rounded shadow-md max-w-lg my-2 ">
          
          <h1 className="text-2xl mb-4">Trainer Profile</h1>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700">
              Name : <span className="font-normal">{trainerData.name}</span>
            </h3>
            <h3 className="text-lg font-medium text-gray-700">
              Email : <span className="font-normal">{trainerData.email}</span>
            </h3>
            <h3 className="text-lg font-medium text-gray-700">
              Role : <span className="font-normal">{trainerData.role}</span>
            </h3>
           
          </div>
        </div>
        <div className=" bg-slate-300 max-w-lg h-80 ">calender</div>
      </div>
      <div className="bg-slate-300 rounded-md m-2 w-full">
        Trainer Details
      </div>
    </div>
  );
};

export default TrainerProfile;
