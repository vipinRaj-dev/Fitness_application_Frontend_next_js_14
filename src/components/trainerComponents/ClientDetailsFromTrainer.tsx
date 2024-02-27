"use client";

import axiosInstance from "@/axios/creatingInstance";
import { CornerRightDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

type User = {
  admissionNumber: number;
  email: string;
  healthIssues: {
    BloodPressure: number;
    Diabetes: number;
    HeartDisease: boolean;
    KidneyDisease: boolean;
    LiverDisease: boolean;
    Others: boolean;
    Thyroid: boolean;
    cholesterol: number;
    _id: string;
  };
  height: number;
  mobileNumber: number;
  name: string;
  profileImage: string;
  trainerPaymentDetails: string[];
  trainerPaymentDueDate: string;
  userBlocked: boolean;
  weight: number;
  _id: string;
};

const ClientDetailsFromTrainer = ({ client_Id }: { client_Id: string }) => {
  const [clientDetails, setClientDetails] = useState<User | null>(null);
  useEffect(() => {
    console.log(client_Id);

    axiosInstance
      .get(`/trainer/client/${client_Id}`)
      .then((res) => {
        console.log(res.data);
        setClientDetails(res.data);
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
            {clientDetails && (
              <div className="p-3 text-black bg-white m-2 mt-12  rounded-3xl text-xs leading-relaxed">
                <div className="mb-2">
                  <img
                    className="h-20 object-cover rounded-full w-20"
                    src={clientDetails.profileImage}
                    alt=""
                  />
                </div>
                <div className="text-xl font-semibold tracking-wide">
                  {clientDetails.name}
                </div>
                <div className="flex">
                  <p>Adm.No : </p>
                  <p>{clientDetails.admissionNumber}</p>
                </div>

                <div className="flex">
                  <p>Weight : </p>
                  {clientDetails.weight}
                </div>
                <div className="flex">
                  <p>Height : </p>
                  {clientDetails.height}
                </div>
                <div className="flex">
                  <p>Mob.No : </p>
                  {clientDetails.mobileNumber}
                </div>

                <div className="flex">
                  <p>Email: </p>
                  {clientDetails.email}
                </div>

                <div className="flex">
                  <p className="text-sm">Health Issues </p>
                </div>
                <div className="ml-10">
                  {Object.entries(clientDetails.healthIssues).map(
                    ([key, value]) => {
                      if (key !== "_id" && value && value !== 0) {
                        return (
                          <div key={key}>
                            {key}: {value === true ? "Yes" : value.toString()}
                          </div>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="bg-black md:h-1/2 w-1/2 md:w-full ">calander</div>
        </div>

        <div className="bg-pink-400 md:w-1/2 h-1/2 md:h-full w-full">
          report
        </div>
      </div>
      <div className="h-screen bg-slate-500">
        <Link href={`/trainer/addDiet/${client_Id}`}><Button>Add Food</Button></Link>
      </div>
    </div>
  );
};

export default ClientDetailsFromTrainer;
