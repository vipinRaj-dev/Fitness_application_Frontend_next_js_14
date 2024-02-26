"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect } from "react";

const ClientDetailsFromTrainer = ({ client_Id }: { client_Id: string }) => {
  useEffect(() => {
    console.log(client_Id);

    axiosInstance
      .get(`/trainer/client/${client_Id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [client_Id]);
  return (
    <div>
      {/* ClientDetailsFromTrainer {client_Id} */}
      <div className="bg-white h-screen md:flex w-full ">
        <div className="bg-red-300 md:w-1/2 flex md:flex md:flex-col w-full h-1/2 md:h-full">
          <div className="bg-blue-300 md:h-1/2 w-1/2 md:w-full  ">
            user profile
          </div>
          <div className="bg-black md:h-1/2 w-1/2 md:w-full ">caleneder</div>
        </div>

        <div className="bg-pink-400 md:w-1/2 h-1/2 md:h-full w-full">
          report
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsFromTrainer;
